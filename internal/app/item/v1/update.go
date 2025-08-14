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

func (s *Server) Update(ctx context.Context, req *connect.Request[pb.ItemServiceUpdateRequest]) (*connect.Response[pb.ItemServiceUpdateResponse], error) {
	rpcName := "Update"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)


	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)


	// Create model for repository from request message
	insertions, err := v1model.ItemProtoToItemModelUpsertSafe(req.Msg.Items, false)
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

	// Get the ids of the inserted items

	rs := []string{}
	for _, v := range insertions {
		rs = append(rs,  v.Id)
	}

	resm := &pb.ItemServiceUpdateResponse{ ItemIds: rs,}

	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful item update. Updated %d items", len(insertions)))
	return connect.NewResponse(resm), nil
}
