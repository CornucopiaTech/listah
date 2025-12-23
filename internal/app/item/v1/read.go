package v1

import (
	"context"
	"fmt"
	v1model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"
	// "strings"
	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.opentelemetry.io/otel"
	// "sort"
	"github.com/uptrace/bun"
	"cornucopia/listah/internal/pkg/model"
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


	// If tags are requested, get the list of unique tags first
	tcw := []model.WhereClause{}
	// whereClause := make([]model.WhereClause), 0)
	// if len(req.Msg.GetTagFilter()) > 0 {
	// 	tcw = append(tcw, model.WhereClause{
	// 		Placeholder: " ?::VARCHAR IN (?) ",
	// 		Column: "id",
	// 		Value:       bun.In(req.Msg.GetId()),
	// 	})
	// }
	if len(req.Msg.GetUserId()) > 0 {
		tcw = append(tcw, model.WhereClause{
			Placeholder: " ? = '?' ",
			Column: "user_id",
			Value:       bun.In(req.Msg.GetUserId()),
		})
	}
	if len(req.Msg.GetCategoryFilter()) > 0 {
		tcw = append(tcw, model.WhereClause{
			Placeholder: " ? IN (?) ",
			Column: "category",
			Value:       bun.In(req.Msg.GetCategory()),
		})
	}


	tagModel := []string{}
	tagCnt, err := s.Infra.BunRepo.Tag.Select(ctx, &tagModel, &tcw, "", 0, 0)
	if  err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d tags from repository", tagCnt))

	catModel := []string{}
	catCnt, err := s.Infra.BunRepo.Category.Select(ctx, &catModel, &tcw, "", 0, 0)
	if  err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d category from repository", catCnt))



	rCnt := int(req.Msg.GetRecordCount())
	pge := int(req.Msg.GetPage())
	srt := req.Msg.GetSearchText()

	if rCnt <= 0 {
		rCnt = int(DefaultReadPagination.RecordsPerPage)
	}
	if pge <= 0 {
		pge = int(DefaultReadPagination.PageNumber)
	}
	// if len(srt) == 0 {
	// 	srt = "created_at DESC"
	// }


	// var qLimit int = req.Msg.GetRecordCount()
	// var qPage int = req.Msg.GetRecordPage()
	// var qSortMap map[string]string

	// pg := req.Msg.GetPagination()
	// if pg == nil {
	// 	qPage = int(DefaultReadPagination.PageNumber)
	// 	qLimit = int(DefaultReadPagination.RecordsPerPage)
	// 	qSortMap = DefaultReadPagination.SortCondition
	// } else {
	// 	qLimit = int(pg.RecordsPerPage)
	// 	qPage = int(pg.PageNumber)
	// 	qSortMap = pg.SortCondition
	// 	if len(qSortMap) == 0 {
	// 		qSortMap = DefaultReadPagination.SortCondition
	// 	}
	// }

	offset := rCnt * (pge - 1)

	recCnt, err := s.Infra.BunRepo.Item.Select(ctx, &readModel, &whereClause, srt, offset, rCnt)
	if  err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d items from repository", recCnt))



	// Convert readModel to response proto
	// using the model conversion function
	rs, err := v1model.ItemModelToItemProto(readModel)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Error getting item proto from item model", errors.Cause(err).Error())
		return nil, err
	}
	resm := &pb.ItemServiceReadResponse{
		Items: rs,
		UserId: req.Msg.GetUserId(),
		Category: catModel,
		Tag: tagModel,

		RecordCount: int32(recCnt),
		Page: int32(pge),
		Sort: srt,

		TagFilter: req.Msg.GetTagFilter(),
		CategoryFilter: req.Msg.GetCategoryFilter(),
		SearchText: req.Msg.GetSearchText(),
		FromDate: req.Msg.GetFromDate(),
		ToDate: req.Msg.GetToDate(),
	}
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful item read. Read %d items", len(readModel)))
	return connect.NewResponse(resm), nil
}
