package v1

import (
	"fmt"
	"context"
	"github.com/pkg/errors"
	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"

	v1model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"
)


func (s *Server) ReadItem(ctx context.Context, req *connect.Request[pb.ItemServiceReadItemRequest]) (*connect.Response[pb.ItemServiceReadItemResponse], error) {
	rpcName := "Read"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer("item-service").Start(ctx, "read")
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// Read model for repository
	imod, err :=  v1model.ReadItemQueryFromRequest(req.Msg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for read", errors.Cause(err).Error())
		return nil, err
	}
	fmt.Printf("\n\n\n\nRead Item Mode: %+v\n\n\n\n", imod)

	m := []*v1model.Item{}
	// Insert model in repository
	err = s.MongoRepo.Item.Read(ctx, &m, imod.Filter)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository  read error", errors.Cause(err).Error())
		return nil, err
	}

	rs, err := v1model.ItemModelToReadResponse(m)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Unable to create response from model", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository read and result prep. Writing response")
	res := &pb.ItemServiceReadItemResponse{
		Items: rs,
	}
	return connect.NewResponse(res), nil
}
