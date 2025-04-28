package v1

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"

	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.opentelemetry.io/otel"
	// "strings"
)

func (s *Server) Create(ctx context.Context, req *connect.Request[pb.ItemServiceCreateRequest]) (*connect.Response[pb.ItemServiceCreateResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "create")
	defer span.End()
	s.Infra.Logger.LogDebug(ctx, svcName, "Create", "Create rpc called")

	// Create model for repository from request message
	insertions, err := v1model.ItemProtoToItemModel(req.Msg.Items, true)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, "Create", "Error getting item model for insertion", errors.Cause(err).Error())
		return nil, err
	}

	w := model.UpsertInfo{
		Conflict: []string{"id", "user_id"},
		Resolve: []string{"summary", "category", "description", "note", "tags",
			"properties", "reactivate_at", "audit"},
	}

	_, err = s.Infra.PgRepo.Item.Upsert(ctx, &insertions, &w)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, "Create", "Repository  update error", errors.Cause(err).Error())
		return nil, err
	}
	s.Infra.Logger.LogDebug(ctx, svcName, "Create", "Successful repository update")

	// Read created model from repository
	readModel := []*v1model.Item{}
	// i := []string{}
	for _, v := range insertions {
		readModel = append(readModel, &v1model.Item{Id: v.Id})
		// i = append(i, v.Id)
	}

	// ToDo: Clean up Where Clause.
	whereClause := []model.WhereClause{}

	if err := s.Infra.PgRepo.Item.Select(ctx, &readModel, &whereClause); err != nil {
		s.Infra.Logger.LogError(ctx, svcName, "Create", "Repository read error", errors.Cause(err).Error())
		return nil, err
	}

	rs, err := v1model.ItemModelToItemProto(readModel)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, "Create", "Error getting item proto from item model", errors.Cause(err).Error())
		return nil, err
	}
	resm := &pb.ItemServiceCreateResponse{
		Items: rs,
	}

	s.Infra.Logger.LogDebug(ctx, svcName, "Create", "Successful repository read")
	return connect.NewResponse(resm), nil
}
