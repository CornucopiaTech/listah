package v1

import (
	"context"
	model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"fmt"

	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.opentelemetry.io/otel"
)

func (s *Server) UpsertItem(ctx context.Context, req *connect.Request[pb.ItemServiceUpsertItemRequest]) (*connect.Response[pb.ItemServiceUpsertItemResponse], error) {
	rpcName := "Upsert"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer("item-service").Start(ctx, "upsert")
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, "Begin "+rpcLogName)
	defer s.Logger.LogInfo(ctx, svcName, rpcName, "End "+rpcLogName)

	// Upsert model for repository
	imod, err := model.UpdateItemQueryFromRequest(req.Msg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for upsert", errors.Cause(err).Error())
		// fmt.Printf("\n\n %+v\n\n", errors.Cause(err).Error())
		return nil, err
	}
	// Insert model in repository
	// err = s.MongoRepo.Item.Update(ctx, imod)
	err = s.MongoRepo.Item.UpdateMany(ctx, imod)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository  upsert error", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository upsert. Writing response")
	iIds := []string{}
	for _, om := range imod {
		iIds = append(iIds, om.Filter["_id"])
	}
	res := &pb.ItemServiceUpsertItemResponse{
		ItemIds: iIds,
	}
	return connect.NewResponse(res), nil
}

func (s *Server) UpsertFilter(ctx context.Context, req *connect.Request[pb.ItemServiceUpsertFilterRequest]) (*connect.Response[pb.ItemServiceUpsertFilterResponse], error) {
	rpcName := "Upsert Filter"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer("item-service").Start(ctx, "upsert")
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, "Begin "+rpcLogName)
	defer s.Logger.LogInfo(ctx, svcName, rpcName, "End "+rpcLogName)

	// Upsert model for repository
	imod, err := model.UpdateFilterQueryFromRequest(req.Msg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for upsert", errors.Cause(err).Error())
		// fmt.Printf("\n\n %+v\n\n", errors.Cause(err).Error())
		return nil, err
	}
	// Insert model in repository
	err = s.MongoRepo.Filter.UpdateMany(ctx, imod)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository  upsert error", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository upsert. Writing response")
	iIds := []string{}
	for _, om := range imod {
		iIds = append(iIds, om.Filter["_id"])
	}
	res := &pb.ItemServiceUpsertFilterResponse{
		FilterIds: iIds,
	}
	return connect.NewResponse(res), nil
}
