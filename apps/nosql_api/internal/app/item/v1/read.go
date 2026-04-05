package v1

import (
	"context"
	"fmt"

	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.opentelemetry.io/otel"

	model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"
)

func (s *Server) ReadItem(ctx context.Context, req *connect.Request[pb.ItemServiceReadItemRequest]) (*connect.Response[pb.ItemServiceReadItemResponse], error) {
	rpcName := "Read Item"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer("item-service").Start(ctx, "read")
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// Read model for repository
	rf, err := model.ReadItemQueryFromRequest(req.Msg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for read", errors.Cause(err).Error())
		return nil, err
	}

	var m []bson.M
	// Insert model in repository
	err = s.MongoRepo.Item.Read(ctx, &m, rf)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository  read error", errors.Cause(err).Error())
		return nil, err
	}
	res := &pb.ItemServiceReadItemResponse{
		Items:            []*pb.Item{},
		TotalRecordCount: 0,
		Query:            req.Msg.GetQuery(),
		Pagination: &pb.Pagination{
			PageSize:   rf.Pagination.PageSize,
			PageNumber: rf.Pagination.PageNumber,
			Sort:       rf.Pagination.Sort,
		},
	}

	err = model.PrepareRepoReadResponse(m, res)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Response parse error", errors.Cause(err).Error())
		return nil, err
	}
	return connect.NewResponse(res), nil
}

func (s *Server) ReadTag(ctx context.Context, req *connect.Request[pb.ItemServiceReadTagRequest]) (*connect.Response[pb.ItemServiceReadTagResponse], error) {
	rpcName := "Read Tag"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer("item-service").Start(ctx, "read")
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// Read model for repository
	rf, err := model.ReadTagQueryFromRequest(req.Msg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error parsing message for tag read", errors.Cause(err).Error())
		return nil, err
	}

	var m []bson.M
	// Read model in repository
	err = s.MongoRepo.Tag.Read(ctx, &m, rf)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}

	res := &pb.ItemServiceReadTagResponse{
		Tags:             []*pb.Tag{},
		TotalRecordCount: 0,
		Query:            req.Msg.GetQuery(),
		Pagination: &pb.Pagination{
			PageSize:   rf.Pagination.PageSize,
			PageNumber: rf.Pagination.PageNumber,
			Sort:       rf.Pagination.Sort,
		},
	}

	err = model.PrepareTagReadResponse(m, res)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Response parse error", errors.Cause(err).Error())
		return nil, err
	}

	s.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository read and result prep. Writing response")
	return connect.NewResponse(res), nil
}

func (s *Server) ReadFilter(ctx context.Context, req *connect.Request[pb.ItemServiceReadFilterRequest]) (*connect.Response[pb.ItemServiceReadFilterResponse], error) {
	rpcName := "Read Filter"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer("item-service").Start(ctx, "read")
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// Read model for repository
	rf, err := model.ReadFilterQueryFromRequest(req.Msg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error parsing message for filter read", errors.Cause(err).Error())
		return nil, err
	}

	var m []bson.M
	// Read model in repository
	err = s.MongoRepo.Filter.Read(ctx, &m, rf)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}

	res := &pb.ItemServiceReadFilterResponse{
		Filters:          []*pb.Filter{},
		TotalRecordCount: 0,
		Query:            req.Msg.GetQuery(),
		Pagination: &pb.Pagination{
			PageSize:   rf.Pagination.PageSize,
			PageNumber: rf.Pagination.PageNumber,
			Sort:       rf.Pagination.Sort,
		},
	}

	err = model.PrepareFilterReadResponse(m, res)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Response parse error", errors.Cause(err).Error())
		return nil, err
	}

	s.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository read and result prep. Writing response")
	return connect.NewResponse(res), nil
}
