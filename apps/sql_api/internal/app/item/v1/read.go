package v1

import (
	"context"
	modelutils "cornucopia/listah/internal/pkg/model"
	model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"fmt"

	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.opentelemetry.io/otel"
)

func (s *Server) ReadItem(ctx context.Context, req *connect.Request[pb.ItemServiceReadItemRequest]) (*connect.Response[pb.ItemServiceReadItemResponse], error) {
	rpcName := "Read Item"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	fmt.Printf("\n\n\nUserId -  %s\n\n\n", req.Msg.GetUserId())
	// fmt.Printf("\n\n\nFilter -  %s\n\n\n", req.Msg.GetQuery().Filters)
	// fmt.Printf("\n\n\nTag -  %s\n\n\n", req.Msg.GetQuery().Tags)

	sq, err := model.ReadItemRequestToRepoItemSearch(req.Msg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting search query from request", errors.Cause(err).Error())
		return nil, err
	}

	readModel := []*model.Item{}

	recordCnt, err := s.BunRepo.Item.Read(ctx, &readModel, sq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d items from repository", recordCnt))

	// Convert readModel to response proto
	// using the model conversion function
	rs, err := model.ItemModelToItemProto(readModel)
	fmt.Printf("\n\n\n\n\nitems -  %+v\n\n\n\n\n", rs[0])
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting item proto from item model", errors.Cause(err).Error())
		return nil, err
	}

	resm := &pb.ItemServiceReadItemResponse{
		Items:            rs,
		TotalRecordCount: int32(recordCnt),
		UserId:           req.Msg.GetUserId(),
		Query:            req.Msg.GetQuery(),
		Pagination:       req.Msg.GetPagination(),
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful item read. Read %d items", len(readModel)))
	return connect.NewResponse(resm), nil
}

func (s *Server) ReadTag(ctx context.Context, req *connect.Request[pb.ItemServiceReadTagRequest]) (*connect.Response[pb.ItemServiceReadTagResponse], error) {
	rpcName := "Read Tag"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// ToDo: Return List of Tags and a Map of tag_id and props for easy iteration in the frontend
	// fmt.Printf("\n\n\nUserId -  %s\n\n\n", req.Msg.GetUserId())

	var riq = &pb.ItemServiceReadItemRequest{}
	err := modelutils.MarshalCopyProto(req.Msg, riq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error marshalling proto message types", errors.Cause(err).Error())
		return nil, err
	}

	sq, err := model.ReadItemRequestToRepoItemSearch(riq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting search query from request", errors.Cause(err).Error())
		return nil, err
	}

	readModel := []*model.Tag{}

	// recordCnt, err := s.BunRepo.Item.ReadTag(ctx, &readModel, sq)
	recordCnt, err := s.BunRepo.Tag.Read(ctx, &readModel, sq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d items from repository", recordCnt))

	// Convert readModel to response proto
	// using the model conversion function
	rs, err := model.TagModelToTagProto(readModel)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting category proto from category model", errors.Cause(err).Error())
		return nil, err
	}

	resm := &pb.ItemServiceReadTagResponse{
		Tags:             rs,
		TotalRecordCount: int32(recordCnt),
		UserId:           req.Msg.GetUserId(),
		Query:            req.Msg.GetQuery(),
		Pagination:       req.Msg.GetPagination(),
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful item read. Read %d items", len(readModel)))
	return connect.NewResponse(resm), nil
}

func (s *Server) ReadFilter(ctx context.Context, req *connect.Request[pb.ItemServiceReadFilterRequest]) (*connect.Response[pb.ItemServiceReadFilterResponse], error) {
	rpcName := "Read Saved Filter"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// fmt.Printf("\n\n\nUserId -  %s\n\n\n", req.Msg.GetUserId())

	var riq = &pb.ItemServiceReadItemRequest{}
	err := modelutils.MarshalCopyProto(req.Msg, riq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error marshalling proto message types", errors.Cause(err).Error())
		return nil, err
	}

	sq, err := model.ReadItemRequestToRepoItemSearch(riq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting search query from request", errors.Cause(err).Error())
		return nil, err
	}

	readModel := []*model.Filter{}

	// recordCnt, err := s.BunRepo.Item.ReadFilter(ctx, &readModel, sq)
	recordCnt, err := s.BunRepo.Filter.Read(ctx, &readModel, sq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d items from repository", recordCnt))

	// Convert readModel to response proto
	// using the model conversion function
	rs, err := model.FilterModelToFilterProto(readModel)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting category proto from category model", errors.Cause(err).Error())
		return nil, err
	}

	resm := &pb.ItemServiceReadFilterResponse{
		Filters:          rs,
		TotalRecordCount: int32(recordCnt),
		UserId:           req.Msg.GetUserId(),
		Query:            req.Msg.GetQuery(),
		Pagination:       req.Msg.GetPagination(),
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful item read. Read %d items", len(readModel)))
	return connect.NewResponse(resm), nil
}
