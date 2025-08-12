package v1

import (
	"context"
	"fmt"
	"strings"
	// "cornucopia/listah/internal/pkg/model"
	v1model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"

	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.opentelemetry.io/otel"
)

var DefaultReadPagination = pb.Pagination{
	PageNumber: 1,
	RecordsPerPage: 100,
	SortCondition: map[string]string{"user_id": "ASC", "id": "ASC"},
}

func (s *Server) Read(ctx context.Context, req *connect.Request[pb.ItemServiceReadRequest]) (*connect.Response[pb.ItemServiceReadResponse], error) {
	ctx, span := otel.Tracer(svcName).Start(ctx, "POST /listah.v1.ItemService/Read")
	defer span.End()
	rpcName := "Read"
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, "Read rpc called")


	readModel := []*v1model.Item{}
	whereClause, err := v1model.ItemProtoToWhereClause(req.Msg.Items)
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

	recCnt, err := s.Infra.PgRepo.Item.Select(ctx, &readModel, &whereClause, qSort, qOffset, qLimit)
	if  err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}

	rs, err := v1model.ItemModelToItemProto(readModel)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Error getting item proto from item model", errors.Cause(err).Error())
		return nil, err
	}
	resm := &pb.ItemServiceReadResponse{
		Items: rs,
		TotalRecordCount: int32(recCnt),
		Pagination: &pb.Pagination{
			PageNumber: int32(qPage),
			RecordsPerPage: int32(qLimit),
			SortCondition: qSortMap,
		},
	}
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository read")
	return connect.NewResponse(resm), nil
}
