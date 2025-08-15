package v1

import (
	"context"
	"fmt"
	v1model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"strings"
	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.opentelemetry.io/otel"
	"sort"
)


func (s *Server) Read(ctx context.Context, req *connect.Request[pb.ItemServiceReadRequest]) (*connect.Response[pb.ItemServiceReadResponse], error) {
	rpcName := "Read"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)


	readModel := []*v1model.Item{}
	whereClause, err := v1model.ItemProtoToWhereClause(req.Msg)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Error getting where clause from request", errors.Cause(err).Error())
		return nil, err
	}

	var qLimit int
	var qPage int
	var qSortMap map[string]string

	pg:= req.Msg.GetPagination()
	if pg == nil {
		qPage = int(DefaultReadPagination.PageNumber)
		qLimit = int(DefaultReadPagination.RecordsPerPage)
		qSortMap = DefaultReadPagination.SortCondition
	} else {
		qLimit = int(pg.RecordsPerPage)
		qPage = int(pg.PageNumber)
		qSortMap = pg.SortCondition
		if len(qSortMap) == 0 {
			qSortMap = DefaultReadPagination.SortCondition
		}
	}

	qOffset := qLimit * (qPage - 1)
	qSortSlice := []string{}
	for key, value := range qSortMap {
		qSortSlice = append(qSortSlice, fmt.Sprintf(" %v %v ", key, value))
	}
	qSort := strings.Join(qSortSlice, ", ")

	recCnt, err := s.Infra.BunRepo.Item.Select(ctx, &readModel, &whereClause, qSort, qOffset, qLimit)
	if  err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d items from repository", recCnt))


	// Collect all tags and categories from the readModel
	// to return them in the response
	var rsTags	[]string
	var rsCategories []string
	for _, item := range readModel {
		if item.Tags != nil {
			rsTags = append(rsTags, item.Tags...)
		}
		if item.Category != "" {
			rsCategories = append(rsCategories, item.Category)
		}
	}

	// Remove duplicates from tags and categories
	tagMap := make(map[string]struct{})
	for _, tag := range rsTags {
		tagMap[tag] = struct{}{}
	}
	catMap := make(map[string]struct{})
	for _, cat := range rsCategories {
		catMap[cat] = struct{}{}
	}
	rsTags = []string{}
	for tag := range tagMap {
		rsTags = append(rsTags, tag)
	}
	rsCategories = []string{}
	for cat := range catMap {
		rsCategories = append(rsCategories, cat)
	}
	// Sort tags and categories
	sort.Strings(rsTags)
	sort.Strings(rsCategories)


	// Convert readModel to response proto
	// using the model conversion function
	rs, err := v1model.ItemModelToItemProto(readModel)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Error getting item proto from item model", errors.Cause(err).Error())
		return nil, err
	}
	resm := &pb.ItemServiceReadResponse{
		Items: rs,
		Tags: rsTags,
		Categories: rsCategories,
		TotalRecordCount: int32(recCnt),
		Pagination: &pb.Pagination{
			PageNumber: int32(qPage),
			RecordsPerPage: int32(qLimit),
			SortCondition: qSortMap,
		},
	}
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful item read. Read %d items, %d unique categories, %d unique tags", len(readModel), len(rsCategories), len(rsTags)))
	return connect.NewResponse(resm), nil
}
