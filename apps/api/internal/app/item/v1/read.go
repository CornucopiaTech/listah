package v1

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"fmt"

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
	fmt.Printf("\n\n\nFilter -  %s\n\n\n", req.Msg.GetQuery().Filters)
	fmt.Printf("\n\n\nTag -  %s\n\n\n", req.Msg.GetQuery().Tags)

	sq, err := v1model.MsgToItemSearch(req.Msg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting search query from request", errors.Cause(err).Error())
		return nil, err
	}

	readModel := []*model.Item{}

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
		Items:  rs,
		UserId: req.Msg.GetUserId(),
		Query:  req.Msg.GetQuery(),
		Pagination: &pb.Pagination{
			PageSize:   int32(recordCnt),
			PageNumber: int32(sq.PageNumber),
			Sort:       sq.SortQuery,
		},
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

	readModel := []*model.Tag{}

	recordCnt, err := s.BunRepo.Item.ReadTag(ctx, &readModel, sq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d items from repository", recordCnt))

	// Convert readModel to response proto
	// using the model conversion function
	rs, err := v1model.TagModelToTagProto(readModel)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting category proto from category model", errors.Cause(err).Error())
		return nil, err
	}

	resm := &pb.ItemServiceReadTagResponse{
		Tags: rs,
		Pagination: &pb.Pagination{
			PageSize:   int32(recordCnt),
			PageNumber: int32(sq.PageNumber),
			Sort:       "name ASC",
		},
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

	readModel := []*model.Filter{}

	recordCnt, err := s.BunRepo.Item.ReadFilter(ctx, &readModel, sq)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d items from repository", recordCnt))

	// Convert readModel to response proto
	// using the model conversion function
	rs, err := v1model.FilterModelToFilterProto(readModel)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting category proto from category model", errors.Cause(err).Error())
		return nil, err
	}

	resm := &pb.ItemServiceReadFilterResponse{
		Filters: rs,
		Pagination: &pb.Pagination{
			PageSize:   int32(recordCnt),
			PageNumber: int32(sq.PageNumber),
			Sort:       "name ASC",
		},
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful item read. Read %d items", len(readModel)))
	return connect.NewResponse(resm), nil
}
