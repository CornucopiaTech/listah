package v1

import (
	"context"
	v1model "cornucopia/listah/internal/pkg/model/v1"
	"cornucopia/listah/internal/pkg/model"
	pb "cornucopia/listah/internal/pkg/proto/v1"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
	// "fmt"
	// "strings"
)

func (s *Server) Read(ctx context.Context, req *connect.Request[pb.ItemServiceReadRequest]) (*connect.Response[pb.ItemServiceReadResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "read")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("Read rpc in ItemService called")

	// Read model for repository from request message
	readModel, err := v1model.ItemProtoToItemModel(req.Msg.Items, true)
	if err != nil {
		s.Infra.Logger.For(ctx).Error("Error getting item model for insertion in Read rpc of ItemService")
		return nil, err
	}

	// ToDo: Clean up Where Clause.
	whereClause := []model.WhereClause{}

	if err := s.Infra.PgRepo.Item.Select(ctx, &readModel, &whereClause); err != nil {
		s.Infra.Logger.For(ctx).Error("Repository read error in Read rpc of ItemService")
		return nil, err
	}

	rs, err := v1model.ItemModelToItemProto(readModel)
	if err != nil {
		s.Infra.Logger.For(ctx).Error("Error getting item proto from item model in Read rpc of ItemService")
		return nil, err
	}
	resm := &pb.ItemServiceReadResponse{
		Items: rs,
	}

	s.Infra.Logger.For(ctx).Info("Successful repository read in Read rpc of ItemService")
	return connect.NewResponse(resm), nil
}
