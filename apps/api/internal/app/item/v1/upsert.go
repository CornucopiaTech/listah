package v1

import (
	"context"
	"fmt"
	"cornucopia/listah/apps/api/internal/pkg/model"
	v1model "cornucopia/listah/apps/api/internal/pkg/model/v1"
	pb "cornucopia/listah/apps/api/internal/pkg/proto/v1"

	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.opentelemetry.io/otel"
)

func (s *Server) Upsert(ctx context.Context, req *connect.Request[pb.ItemServiceUpsertRequest]) (*connect.Response[pb.ItemServiceUpsertResponse], error) {
	rpcName := "Update"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)


	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)


	// Create model for repository from request message
	ins, res, err := v1model.ItemProtoToItemModel(req.Msg.Items, false)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for insertion", errors.Cause(err).Error())
		return nil, err
	}


	w := model.UpsertInfo{
		Conflict: v1model.ItemConflictFields,
		Resolve: res,
	}

	_, err = s.BunRepo.Item.Upsert(ctx, &ins, &w)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository  update error", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository update")

	// Get the ids of the inserted items

	rs := []string{}
	for _, v := range ins {
		rs = append(rs,  v.Id)
	}

	resm := &pb.ItemServiceUpsertResponse{ ItemIds: rs,}

	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful item update. Updated %d items", len(ins)))
	return connect.NewResponse(resm), nil
}
