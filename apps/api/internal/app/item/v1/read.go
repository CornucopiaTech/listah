package v1

import (
	"connectrpc.com/connect"
	"context"
	"fmt"
	"go.opentelemetry.io/otel"

	modelutils "cornucopia/listah/internal/pkg/model"
	model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"
)

func (s *Server) ReadItem(ctx context.Context, req *connect.Request[pb.ItemServiceReadItemRequest]) (*connect.Response[pb.ItemServiceReadItemResponse], error) {
	rpcName := "ReadItem"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)
	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	fmt.Printf("\n\n\n\n")
	fmt.Printf("\n\n\nUserId -  %s\n", req.Msg.GetQuery().UserId)
	fmt.Printf("\nTag -  %s\n", req.Msg.GetQuery().Tags)
	fmt.Printf("\nPagination -  %s\n", req.Msg.GetPagination())


	sq, err := model.ReadItemRequestToRepoRepoSearch(req.Msg)
	if err != nil {
		return nil, err
	}

	readModel := []*model.Item{}

	recordCnt, err := s.BunRepo.Item.Read(ctx, &readModel, sq)
	if err != nil {
		return nil, err
	}

	// Convert readModel to response proto
	// using the model conversion function
	rs, err := model.ItemModelToItemProto(readModel)
	if err != nil {
		return nil, err
	}

	pg := req.Msg.GetPagination()
	pg.Volume = int64(recordCnt)
	fmt.Printf("\nResponse Pagination -  %+v\n", pg)
	resm := &pb.ItemServiceReadItemResponse{
		Items:            rs,
		Query:            req.Msg.GetQuery(),
		Pagination:       pg,
	}
	return connect.NewResponse(resm), nil
}

func (s *Server) ReadTag(ctx context.Context, req *connect.Request[pb.ItemServiceReadTagRequest]) (*connect.Response[pb.ItemServiceReadTagResponse], error) {
	rpcName := "ReadTag"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)
	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// fmt.Printf("\n\n\n\n")
	// fmt.Printf("\n\n\nUserId -  %s\n", req.Msg.GetQuery().UserId)
	// fmt.Printf("\nTag -  %s\n", req.Msg.GetQuery().Tags)
	// fmt.Printf("\nPagination -  %s\n", req.Msg.GetPagination())


	var riq = &pb.ItemServiceReadItemRequest{}
	err := modelutils.MarshalCopyProto(req.Msg, riq)
	if err != nil {
		return nil, err
	}

	sq, err := model.ReadItemRequestToRepoRepoSearch(riq)
	if err != nil {
		return nil, err
	}

	readModel := []*model.Tag{}
	recordCnt, err := s.BunRepo.Tag.Read(ctx, &readModel, sq)
	if err != nil {
		return nil, err
	}

	readIdModel := []model.TagPropertyMapModel{}
	err = s.BunRepo.Tag.ReadIdProperty(ctx, &readIdModel, sq)
	if err != nil {
		return nil, err
	}

	// Convert readModel to response proto using the model conversion function
	rs, err := model.TagModelToTagProto(readModel)
	if err != nil {
		return nil, err
	}
	// fmt.Printf("\nTags -  %+v\n", rs[0])
	// Convert readModel to response proto using the model conversion function
	ms, err := model.MapModelToTagPropertyMapProto(readIdModel)
	if err != nil {
		return nil, err
	}
	// fmt.Printf("\nTagProps -  %+v\n", ms)

	pg := req.Msg.GetPagination()
	pg.Volume = int64(recordCnt)
	resm := &pb.ItemServiceReadTagResponse{
		Tags:             rs,
		TagidPropMap:     ms,
		Query:            req.Msg.GetQuery(),
		Pagination:       pg,
	}
	// fmt.Printf("\nResponse -  %+v\n", resm)
	// fmt.Printf("\n\n\n\n")
	return connect.NewResponse(resm), nil
}

func (s *Server) ReadTagProperty(ctx context.Context, req *connect.Request[pb.ItemServiceReadTagPropertyRequest]) (*connect.Response[pb.ItemServiceReadTagPropertyResponse], error) {
	rpcName := "Read TagProperty"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)
	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	var riq = &pb.ItemServiceReadItemRequest{}
	err := modelutils.MarshalCopyProto(req.Msg, riq)
	if err != nil {
		return nil, err
	}

	sq, err := model.ReadItemRequestToRepoRepoSearch(riq)
	if err != nil {
		return nil, err
	}

	readModel := []model.TagPropertyMapModel{}
	recordCnt, err := s.BunRepo.Tag.ReadProperty(ctx, &readModel, sq)
	if err != nil {
		return nil, err
	}

	// Convert readModel to response proto using the model conversion function
	rs, err := model.TagPropertyModelToTagPropertyMapProto(readModel)
	if err != nil {
		return nil, err
	}

	pg := req.Msg.GetPagination()
	pg.Volume = int64(recordCnt)
	resm := &pb.ItemServiceReadTagPropertyResponse{
		Props:            rs,
		Query:            req.Msg.GetQuery(),
		Pagination:       pg,
	}
	return connect.NewResponse(resm), nil
}

func (s *Server) ReadFilter(ctx context.Context, req *connect.Request[pb.ItemServiceReadFilterRequest]) (*connect.Response[pb.ItemServiceReadFilterResponse], error) {
	rpcName := "ReadFilter"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)
	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	var riq = &pb.ItemServiceReadItemRequest{}
	err := modelutils.MarshalCopyProto(req.Msg, riq)
	if err != nil {
		return nil, err
	}

	sq, err := model.ReadItemRequestToRepoRepoSearch(riq)
	if err != nil {
		return nil, err
	}

	readModel := []*model.Filter{}
	recordCnt, err := s.BunRepo.Filter.Read(ctx, &readModel, sq)
	if err != nil {
		return nil, err
	}

	// Convert readModel to response proto using the model conversion function
	rs, err := model.FilterModelToFilterProto(readModel)
	if err != nil {
		return nil, err
	}

	pg := req.Msg.GetPagination()
	pg.Volume = int64(recordCnt)
	resm := &pb.ItemServiceReadFilterResponse{
		Filters:          rs,
		Query:            req.Msg.GetQuery(),
		Pagination:       pg,
	}
	return connect.NewResponse(resm), nil
}
