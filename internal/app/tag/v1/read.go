package v1

import (
	"context"
	"fmt"
	"cornucopia/listah/internal/pkg/model"
	// v1model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.opentelemetry.io/otel"
		// "github.com/uptrace/bun"
)


func (s *Server) Read(ctx context.Context, req *connect.Request[pb.TagServiceReadRequest]) (*connect.Response[pb.TagServiceReadResponse], error) {
	rpcName := "Read"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)


	readModel := []string{}
	whereClause := []model.WhereClause{}
	if len(req.Msg.GetUserId()) > 0 {
		whereClause = append(whereClause, model.WhereClause{
			Placeholder: " ? = ?",
			Column: "user_id",
			// Value:       bun.In(req.Msg.GetUserId()),
			Value:       req.Msg.GetUserId(),
		})
	}

	var qOffset int
	var qLimit int
	var qSort string


	recCnt, err := s.BunRepo.Tag.Select(ctx, &readModel, &whereClause, qSort, qOffset, qLimit)
	if  err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d category from repository", recCnt))


	resm := &pb.TagServiceReadResponse{
		Tag: readModel,
		// TotalRecordCount: int32(recCnt),
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful category read. Read %d unique tags.", len(readModel)))
	return connect.NewResponse(resm), nil
}
