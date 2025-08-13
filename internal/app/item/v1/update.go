package v1

import (
	"context"
	"fmt"
	"strings"
	"cornucopia/listah/internal/pkg/model"
	v1model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"

	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.opentelemetry.io/otel"
	// "strings"
)

func (s *Server) Update(ctx context.Context, req *connect.Request[pb.ItemServiceUpdateRequest]) (*connect.Response[pb.ItemServiceUpdateResponse], error) {
	rpcName := "Update"
	ctx, span := otel.Tracer(svcName).Start(ctx, "POST /listah.v1.ItemService/Update")
	defer span.End()
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, "POST /listah.v1.ItemService/Update")

	fmt.Printf("\n\n\nMsgs: %#v \n%#v \n\n\n\n", req.Msg.Items[0], req.Msg.Items[0].SoftDelete)
	// Create model for repository from request message
	insertions, err := v1model.ItemProtoToItemModelUpsertSafe(req.Msg.Items, false)
	// insertions, err := v1model.ItemProtoToItemModel(req.Msg.Items, false)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for insertion", errors.Cause(err).Error())
		return nil, err
	}

	fmt.Printf("\n\n\nInsertions: %#v \n %v \n %#v \n\n\n\n", insertions[0], len(insertions), insertions[0].SoftDelete)

	w := model.UpsertInfo{
		Conflict: []string{"id", "user_id"},
		Resolve: []string{"summary", "category", "description", "note", "tags",
			"properties", "reactivate_at", "audit", "soft_delete"},
	}

	_, err = s.Infra.BunRepo.Item.Upsert(ctx, &insertions, &w)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Repository  update error", errors.Cause(err).Error())
		return nil, err
	}
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository update")

	// Read created model from repository
	readModel := []*v1model.Item{}
	for _, v := range insertions {
		readModel = append(readModel, &v1model.Item{Id: v.Id, UserId: v.UserId})
	}

	whereClause, err := v1model.ItemModelToWhereClause(readModel)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Error getting where clause from request", errors.Cause(err).Error())
		return nil, err
	}

	qLimit := len(readModel)
	qPage := 1
	qOffset := qLimit * (qPage - 1)
	qSortMap := DefaultReadPagination.SortCondition
	qSortSlice := []string{}
	for key, value := range qSortMap {
		qSortSlice = append(qSortSlice, fmt.Sprintf(" %v %v ", key, value))
	}
	qSort := strings.Join(qSortSlice, ", ")

	recCnt, err := s.Infra.BunRepo.Item.Select(ctx, &readModel, &whereClause, qSort, qOffset, qLimit)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}

	rs, err := v1model.ItemModelToItemProto(readModel)
	if err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Error getting item proto from item model", errors.Cause(err).Error())
		return nil, err
	}
	resm := &pb.ItemServiceUpdateResponse{
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
