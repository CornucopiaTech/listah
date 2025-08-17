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
		"github.com/uptrace/bun"
)


func (s *Server) Read(ctx context.Context, req *connect.Request[pb.TagServiceReadRequest]) (*connect.Response[pb.TagServiceReadResponse], error) {
	rpcName := "Read"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)


	readModel := []string{}
	whereClause := []model.WhereClause{}
	// whereClause := make([]model.WhereClause), 0)
	if len(req.Msg.GetId()) > 0 {
		whereClause = append(whereClause, model.WhereClause{
			Placeholder: " ?::VARCHAR IN (?) ",
			Column: "id",
			Value:       bun.In(req.Msg.GetId()),
		})
	}

	if len(req.Msg.GetUserId()) > 0 {
		whereClause = append(whereClause, model.WhereClause{
			Placeholder: " ? IN (?) ",
			Column: "user_id",
			Value:       bun.In(req.Msg.GetUserId()),
		})
	}

	var qOffset int
	var qLimit int
	var qSort string


	recCnt, err := s.Infra.BunRepo.Tag.Select(ctx, &readModel, &whereClause, qSort, qOffset, qLimit)
	if  err != nil {
		s.Infra.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Read %d category from repository", recCnt))


	resm := &pb.TagServiceReadResponse{Tag: readModel, TotalRecordCount: int32(recCnt),}
	s.Infra.Logger.LogInfo(ctx, svcName, rpcName, fmt.Sprintf("Successful category read. Read %d unique tags.", len(readModel)))
	return connect.NewResponse(resm), nil
}
