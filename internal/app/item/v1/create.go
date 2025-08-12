package v1

import (
	"context"
	"fmt"
	"cornucopia/listah/internal/pkg/model"
	v1model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"

	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.opentelemetry.io/otel"
	"strings"
)

func (s *Server) Create(ctx context.Context, req *connect.Request[pb.ItemServiceCreateRequest]) (*connect.Response[pb.ItemServiceCreateResponse], error) {
	ctx, span := otel.Tracer(svcName).Start(ctx, "POST /listah.v1.ItemService/Create")
	defer span.End()
	rpcName := "Create"
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, "POST /listah.v1.ItemService/Create")

	// Create model for repository from request message
	insertions, err := v1model.ItemProtoToItemModel(req.Msg.Items, true)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for insertion", errors.Cause(err).Error())
		return nil, err
	}

	w := model.UpsertInfo{
		Conflict: []string{"id", "user_id"},
		Resolve: []string{"summary", "category", "description", "note", "tags",
			"properties", "reactivate_at", "audit", "soft_delete"},
	}

	_, err = s.Infra.PgRepo.Item.Upsert(ctx, &insertions, &w)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Repository  update error", errors.Cause(err).Error())
		return nil, err
	}
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository update")

	// Read created model from repository
	readModel := []*v1model.Item{}

	whereClause, err := v1model.ItemModelToWhereClausePkey(insertions)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Error getting where clause from request", errors.Cause(err).Error())
		return nil, err
	}

	qLimit := len(readModel)
	qPage := 1
	qOffset := 0
	qSortMap := DefaultReadPagination.SortCondition
	qSortSlice := []string{}
	for key, value := range qSortMap {
		qSortSlice = append(qSortSlice, fmt.Sprintf(" %v %v ", key, value))
	}
	qSort := strings.Join(qSortSlice, ", ")

	recCnt, err := s.Infra.PgRepo.Item.Select(ctx, &readModel, &whereClause, qSort, qOffset, qLimit)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}


	rs, err := v1model.ItemModelToItemProto(readModel)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Error getting item proto from item model", errors.Cause(err).Error())
		return nil, err
	}
	resm := &pb.ItemServiceCreateResponse{
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
