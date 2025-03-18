package v1

import (
	"context"
	v1model "cornucopia/listah/internal/pkg/model/v1"
	"cornucopia/listah/internal/pkg/model"
	pb "cornucopia/listah/internal/pkg/proto/v1"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
	"fmt"
	// "strings"
)

func (s *Server) Create(ctx context.Context, req *connect.Request[pb.ItemServiceCreateRequest]) (*connect.Response[pb.ItemServiceCreateResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "create")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("Create rpc in ItemService called")

	// Create model for repository from request message
	insertions, err := v1model.ItemProtoToItemModel(req.Msg.Items, true)
	if err != nil {
		s.Infra.Logger.For(ctx).Error("Error getting item model for insertion in Create rpc of ItemService")
		return nil, err
	}

	w := model.UpsertInfo{
		Conflict: []string{"id", "user_id"},
		Resolve:  []string{"summary", "category", "description", "note", "tags",
			"properties", "reactivate_at", "audit",},
	}

	res, err := s.Infra.PgRepo.Item.Upsert(ctx, &insertions, &w);
	if err != nil {
		s.Infra.Logger.For(ctx).Info("Repository  update error in Create rpc of ItemService")
		return nil, err
	}
	s.Infra.Logger.For(ctx).Info("Successful repository update in Create rpc of ItemService")

	fmt.Print("\n\n\n\nRes:")
	fmt.Print(res)
	fmt.Print("\n\n\n\n")

	// Read created model from repository
	readModel := []*v1model.Item{}
	i := []string{}
	for _, v := range insertions {
		readModel = append(readModel, &v1model.Item{Id: v.Id})
		i = append(i, v.Id)
	}

	// ToDo: Clean up Where Clause.
	whereClause := []model.WhereClause{}

	if err := s.Infra.PgRepo.Item.Select(ctx, &readModel, &whereClause); err != nil {
		s.Infra.Logger.For(ctx).Error("Repository read error in Create rpc of ItemService")
		return nil, err
	}

	rs, err := v1model.ItemModelToItemProto(readModel)
	if err != nil {
		s.Infra.Logger.For(ctx).Error("Error getting item proto from item model in Create rpc of ItemService")
		return nil, err
	}
	resm := &pb.ItemServiceCreateResponse{
		Items: rs,
	}

	s.Infra.Logger.For(ctx).Info("Successful repository read in Create rpc of ItemService")
	return connect.NewResponse(resm), nil
}
