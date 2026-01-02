package v1

import (
	"context"
	"fmt"
	"cornucopia/listah/internal/pkg/model"
	v1model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"

	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.opentelemetry.io/otel"
)

func (s *Server) Create(ctx context.Context, req *connect.Request[pb.ItemServiceCreateRequest]) (*connect.Response[pb.ItemServiceCreateResponse], error) {
	rpcName := "Create"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)


	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// Create model for repository from request message
	insertions, err := v1model.IItemToItemModel(req.Msg.Items, true)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for insertion", errors.Cause(err).Error())
		return nil, err
	}

	w := model.UpsertInfo{
		Conflict: v1model.ItemConflictFields,
		Resolve: v1model.ItemResolveFields,
	}

	_, err = s.Infra.BunRepo.Item.Upsert(ctx, &insertions, &w)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Repository  update error", errors.Cause(err).Error())
		return nil, err
	}
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository update")

	rs := []string{}
	for _, v := range insertions {
		rs = append(rs,  v.Id)
	}


	resm := &pb.ItemServiceCreateResponse{
		ItemIds: rs,
	}

	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful item creation. Created %d items", len(insertions)))
	return connect.NewResponse(resm), nil
}
