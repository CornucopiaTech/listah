package v1

import (
	"fmt"
	"context"
	v1model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"github.com/pkg/errors"
	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
)


func (s *Server) UpsertItem(ctx context.Context, req *connect.Request[pb.ItemServiceUpsertItemRequest]) (*connect.Response[pb.ItemServiceUpsertItemResponse], error) {
	rpcName := "Upsert"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer("item-service").Start(ctx, "upsert")
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// Upsert model for repository
	imod, err :=  v1model.UpdateItemQueryFromRequest(req.Msg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for upsert", errors.Cause(err).Error())
		return nil, err
	}
	fmt.Printf("\n\n\n\nUpsert Item Mode: %+v\n\n\n\n", imod[0])

	// Insert model in repository
	err = s.MongoRepo.Item.Update(ctx, imod)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository  upsert error", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository upsert. Writing response")
	iIds := []string{}
	for _, om := range imod{
		iIds = append(iIds, om.Filter["_id"])
	}
	res := &pb.ItemServiceUpsertItemResponse{
		ItemIds: iIds,
	}
	return connect.NewResponse(res), nil
}
