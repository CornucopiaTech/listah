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


func (s *Server) ReadItem(ctx context.Context, req *connect.Request[pb.ItemServiceReadItemRequest]) (*connect.Response[pb.ItemServiceReadItemResponse], error) {
	rpcName := "Read"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	fmt.Printf("\n\n\nUserId -  %s\n\n\n", req.Msg.GetUserId())
	fmt.Printf("\n\n\nSavedFilter -  %s\n\n\n", req.Msg.GetSavedFilters())
	fmt.Printf("\n\n\nTag -  %s\n\n\n", req.Msg.GetTags())

	sq, err := v1model.MsgToItemSearch(req.Msg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting search query from request", errors.Cause(err).Error())
		return nil, err
	}

	readModel := []*v1model.Item{}

	recordCnt, err := s.BunRepo.Item.ReadItem(ctx, &readModel, sq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d items from repository", recordCnt))



	// Convert readModel to response proto
	// using the model conversion function
	rs, err := v1model.ItemModelToItemProto(readModel)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting item proto from item model", errors.Cause(err).Error())
		return nil, err
	}

	resm := &pb.ItemServiceReadItemResponse{
		Items: rs,
		UserId: req.Msg.GetUserId(),
		Tags: req.Msg.GetTags(),
		SavedFilters: req.Msg.GetSavedFilters(),
		SearchQuery: req.Msg.GetSearchQuery(),
		PageSize: int32(recordCnt),
		PageNumber: int32(sq.PageNumber),
		SortQuery: sq.SortQuery,
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

	fmt.Printf("\n\n\nUserId -  %s\n\n\n", req.Msg.GetUserId())

	var riq = &pb.ItemServiceReadItemRequest{}
	err := model.MarshalCopyProto(req.Msg, riq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error marshalling proto message types", errors.Cause(err).Error())
		return nil, err
	}

	sq, err := v1model.MsgToItemSearch(riq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting search query from request", errors.Cause(err).Error())
		return nil, err
	}

	readModel := []*v1model.Category{}

	recordCnt, err := s.BunRepo.Item.ReadTag(ctx, &readModel, sq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d items from repository", recordCnt))



	// Convert readModel to response proto
	// using the model conversion function
	rs, err := v1model.CategoryModelToCategoryProto(readModel)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting category proto from category model", errors.Cause(err).Error())
		return nil, err
	}

	resm := &pb.ItemServiceReadTagResponse{
		Categories: rs,
		UserId: req.Msg.GetUserId(),
		PageSize: int32(recordCnt),
		PageNumber: int32(sq.PageNumber),
		SortQuery: "category ASC",
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful item read. Read %d items", len(readModel)))
	return connect.NewResponse(resm), nil
}


func (s *Server) ReadSavedFilter(ctx context.Context, req *connect.Request[pb.ItemServiceReadSavedFilterRequest]) (*connect.Response[pb.ItemServiceReadSavedFilterResponse], error) {
	rpcName := "Read Saved Filter"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	fmt.Printf("\n\n\nUserId -  %s\n\n\n", req.Msg.GetUserId())

	var riq = &pb.ItemServiceReadItemRequest{}
	err := model.MarshalCopyProto(req.Msg, riq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error marshalling proto message types", errors.Cause(err).Error())
		return nil, err
	}

	sq, err := v1model.MsgToItemSearch(riq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting search query from request", errors.Cause(err).Error())
		return nil, err
	}

	readModel := []*v1model.Category{}

	recordCnt, err := s.BunRepo.Item.ReadSavedFilter(ctx, &readModel, sq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d items from repository", recordCnt))



	// Convert readModel to response proto
	// using the model conversion function
	rs, err := v1model.CategoryModelToCategoryProto(readModel)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting category proto from category model", errors.Cause(err).Error())
		return nil, err
	}

	resm := &pb.ItemServiceReadSavedFilterResponse{
		Categories: rs,
		UserId: req.Msg.GetUserId(),
		PageSize: int32(recordCnt),
		PageNumber: int32(sq.PageNumber),
		SortQuery: "category ASC",
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful item read. Read %d items", len(readModel)))
	return connect.NewResponse(resm), nil
}

