package v1

import (
	"fmt"
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"github.com/pkg/errors"
	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
)


func (s *Server) CreateItem(ctx context.Context, req *connect.Request[pb.ItemServiceCreateItemRequest]) (*connect.Response[pb.ItemServiceCreateItemResponse], error) {
	rpcName := "Update"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer("item-service").Start(ctx, "create")
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// Create model for repository
	var riq = &pb.ItemServiceUpsertItemRequest{}
	err := model.MarshalCopyProto(req.Msg, riq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error marshalling request for insertion", errors.Cause(err).Error())
		return nil, err
	}
	imod, err :=  v1model.InsertItemQueryFromRequest(riq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for insertion", errors.Cause(err).Error())
		return nil, err
	}
	fmt.Printf("\n\n\n\nCreated Item Mode: %+v\n\n\n\n", imod[0])

	// Insert model in repository
	iId, err := s.MongoRepo.Item.Insert(ctx, imod)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository  insertion error", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository insertion. Writing response")
	res := &pb.ItemServiceCreateItemResponse{
		ItemIds: iId,
	}
	return connect.NewResponse(res), nil
}
