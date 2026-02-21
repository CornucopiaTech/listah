package v1

import (
	"context"
	"fmt"
		// "net/http"
	"cornucopia/listah/apps/api/internal/pkg/model"
	// v1model "cornucopia/listah/apps/api/internal/pkg/model/v1"
	pb "cornucopia/listah/apps/api/internal/pkg/proto/v1"
	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.opentelemetry.io/otel"
		// "github.com/uptrace/bun"
)


func (s *Server) ReadCategory(ctx context.Context, req *connect.Request[pb.TagServiceCategoryReadRequest]) (*connect.Response[pb.TagServiceCategoryReadResponse], error) {
	rpcName := "Read"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)


	readModel := []*pb.TagCategoryQuery{}
	whereClause := []model.WhereClause{}
	if len(req.Msg.GetUserId()) > 0 {
		whereClause = append(whereClause, model.WhereClause{
			Placeholder: " ? = ?",
			Column: "user_id",
			Value:       req.Msg.GetUserId(),
		})
	}

	var qOffset int
	var qLimit int
	var qSort string


	recCnt, err := s.BunRepo.Tag.SelectGroup(ctx, &readModel, &whereClause, qSort, qOffset, qLimit)
	if  err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	recCnt = len(readModel)
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d tag category group from repository", recCnt))


	resm := &pb.TagServiceCategoryReadResponse{
		Tags: readModel,
		UserId: req.Msg.GetUserId(),
		PageSize: int32(recCnt),
		SortQuery: "tag ASC",
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful category read. Read %d unique tags.", len(readModel)))
	return connect.NewResponse(resm), nil
}


// func (s *Server) ReadItem(ctx context.Context, req *connect.Request[pb.TagServiceItemReadRequest]) (*connect.Response[pb.TagServiceItemReadResponse], error) {
// 	rpcName := "Read"
// 	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

// 	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
// 	defer span.End()
// 	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

// 	// req, err := http.NewRequest("POST", url, strings.NewReader(form.Encode()))


// 	readModel := []*pb.TagCategoryQuery{}
// 	whereClause := []model.WhereClause{}
// 	if len(req.Msg.GetUserId()) > 0 {
// 		whereClause = append(whereClause, model.WhereClause{
// 			Placeholder: " ? = ?",
// 			Column: "user_id",
// 			Value:       req.Msg.GetUserId(),
// 		})
// 	}

// 	var qOffset int
// 	var qLimit int
// 	var qSort string


// 	recCnt, err := s.BunRepo.Tag.SelectGroup(ctx, &readModel, &whereClause, qSort, qOffset, qLimit)
// 	if  err != nil {
// 		s.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
// 		return nil, err
// 	}
// 	recCnt = len(readModel)
// 	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d tag category group from repository", recCnt))


// 	resm := &pb.TagServiceCategoryReadResponse{
// 		Tags: readModel,
// 		UserId: req.Msg.GetUserId(),
// 		PageSize: int32(recCnt),
// 		SortQuery: "tag ASC",
// 	}
// 	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful category read. Read %d unique tags.", len(readModel)))
// 	return connect.NewResponse(resm), nil
// }
