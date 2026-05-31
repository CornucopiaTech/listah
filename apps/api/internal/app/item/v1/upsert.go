package v1

import (
	"context"
	"fmt"
	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"

	model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"
)

func (s *Server) UpsertItem(ctx context.Context, req *connect.Request[pb.ItemServiceUpsertItemRequest]) (*connect.Response[pb.ItemServiceUpsertItemResponse], error) {
	rpcName := "UpsertItem"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// Create model for repository from request message
	i, c, err := model.ItemProtoToItemModel(req.Msg.Items, true)
	if err != nil { return nil, err }

	w := model.UpsertInfo{Conflict: model.ItemConflictFields, Resolve: c}
	_, err = s.BunRepo.Item.Upsert(ctx, &i, &w)
	if err != nil { return nil, err }

	// Get the ids of the inserted items
	rs := []string{}
	for _, v := range i { rs = append(rs, v.Id) }

	resm := &pb.ItemServiceUpsertItemResponse{ItemIds: rs}
	return connect.NewResponse(resm), nil
}

func (s *Server) UpsertFilter(ctx context.Context, req *connect.Request[pb.ItemServiceUpsertFilterRequest]) (*connect.Response[pb.ItemServiceUpsertFilterResponse], error) {
	rpcName := "UpsertFilter"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// Create model for repository from request message
	ins, res, err := model.FilterProtoToFilterModel(req.Msg.Filters, true)
	if err != nil { return nil, err }

	w := model.UpsertInfo{ Conflict: []string{"user_id", "id"}, Resolve:  res, }
	_, err = s.BunRepo.Filter.Upsert(ctx, &ins, &w)
	if err != nil { return nil, err }
	s.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository update")

	// Get the ids of the inserted items
	rs := []string{}
	for _, v := range ins { rs = append(rs, v.Id) }

	resm := &pb.ItemServiceUpsertFilterResponse{FilterIds: rs}
	return connect.NewResponse(resm), nil
}

func (s *Server) UpsertTag(ctx context.Context, req *connect.Request[pb.ItemServiceUpsertTagRequest]) (*connect.Response[pb.ItemServiceUpsertTagResponse], error) {
	rpcName := "UpsertTag"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer(svcName).Start(ctx, rpcLogName)
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// Create model for repository from request message
	ins, res, err := model.TagProtoToTagModel(req.Msg.Tags, true)
	if err != nil { return nil, err }

	w := model.UpsertInfo{Conflict: []string{"user_id", "id"}, Resolve: res}
	_, err = s.BunRepo.Tag.Upsert(ctx, &ins, &w)
	if err != nil { return nil, err }
	s.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository update")

	// Get the ids of the inserted items
	rs := []string{}
	for _, v := range ins { rs = append(rs, v.Id) }
	resm := &pb.ItemServiceUpsertTagResponse{TagIds: rs}
	return connect.NewResponse(resm), nil
}
