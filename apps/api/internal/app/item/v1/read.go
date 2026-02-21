package v1

import (
	"context"
	"fmt"
	v1model "cornucopia/listah/apps/api/internal/pkg/model/v1"
	pb "cornucopia/listah/apps/api/internal/pkg/proto/v1"
	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.opentelemetry.io/otel"
)


func (s *Server) Read(ctx context.Context, req *connect.Request[pb.ItemServiceReadRequest]) (*connect.Response[pb.ItemServiceReadResponse], error) {
	rpcName := "Read"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	fmt.Printf("\n\n\nUserId -  %s\n\n\n", req.Msg.GetUserId())


	readModel := []*v1model.Item{}
	whereClause, err := v1model.IItemToWhereClause(req.Msg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting where clause from request", errors.Cause(err).Error())
		return nil, err
	}


	userId := req.Msg.GetUserId()
	pSize := int(req.Msg.GetPageSize())
	pNum := int(req.Msg.GetPageNumber())
	sortT := req.Msg.GetSortQuery()


	if pSize <= 0 {
		pSize = int(DefaultReadPagination.PageSize)
	}
	if pNum <= 0 {
		pNum = int(DefaultReadPagination.PageNumber)
	}

	offset := pSize * (pNum - 1)
	numTags := req.Msg.GetFilter()
	var recordCnt int

	if len(numTags) > 0 {
		recordCnt, err = s.BunRepo.Tag.SelectItem(ctx, &readModel, &whereClause, sortT, offset, pSize) //nolint
		recordCnt = len(readModel)
	} else {
		recordCnt, err = s.BunRepo.Item.Select(ctx, &readModel, &whereClause, sortT, offset, pSize) //nolint
	}


	if  err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d items from repository", recordCnt))



	// Convert readModel to response proto
	// using the model conversion function
	rs, err := v1model.ItemModelToIItem(readModel)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting item proto from item model", errors.Cause(err).Error())
		return nil, err
	}
	resm := &pb.ItemServiceReadResponse{
		Items: rs,
		UserId: userId,
		Filter: req.Msg.GetFilter(),
		SearchQuery: req.Msg.GetSearchQuery(),
		PageSize: int32(recordCnt),
		PageNumber: int32(pNum),
		SortQuery: sortT,
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful item read. Read %d items", len(readModel)))
	return connect.NewResponse(resm), nil
}
