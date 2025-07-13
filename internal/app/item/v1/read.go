package v1

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"

	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.opentelemetry.io/otel"
)

func (s *Server) Read(ctx context.Context, req *connect.Request[pb.ItemServiceReadRequest]) (*connect.Response[pb.ItemServiceReadResponse], error) {
	ctx, span := otel.Tracer(svcName).Start(ctx, "POST /listah.v1.ItemService/Read")
	defer span.End()
	rpcName := "Read"
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, "Read rpc called")

	// Read model for repository from request message
	readModel, err := v1model.ItemProtoToItemModel(req.Msg.Items, true)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for insertion", errors.Cause(err).Error())
		return nil, err
	}

	// ToDo: Clean up Where Clause.
	whereClause := []model.WhereClause{}

	if err := s.Infra.PgRepo.Item.Select(ctx, &readModel, &whereClause); err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}

	rs, err := v1model.ItemModelToItemProto(readModel)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Error getting item proto from item model", errors.Cause(err).Error())
		return nil, err
	}
	resm := &pb.ItemServiceReadResponse{
		Items: rs,
	}

	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository read")
	return connect.NewResponse(resm), nil
}
