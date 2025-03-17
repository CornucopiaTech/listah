package v1

import (
	"context"
	v1model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
)

func (s *Server) Create(ctx context.Context, req *connect.Request[pb.ItemServiceCreateRequest]) (*connect.Response[pb.ItemServiceCreateResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "create")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("Create rpc in ItemService called")

	// Create model for repository from request message
	insertions, err := v1model.ItemFromCreateRequest(req.Msg.Items)
	if err != nil {
		s.Infra.Logger.For(ctx).Error("Error getting item model in Create rpc of ItemService")
		return nil, err
	}

	// Insert model in repository
	setColumns := []string{
		"user_id",
		"summary",
		"category",
		"description",
		"note",
		"tags",
		"properties",
		"reactivate_at",
		"audit",
	}
	whereColumns := []string{
		"id::VARCHAR",
	}

	if err := s.Infra.PgRepo.Item.Update(ctx, &insertions, (*v1model.Item)(nil), setColumns, whereColumns, "it"); err != nil {
		s.Infra.Logger.For(ctx).Info("Repository  update error in Create rpc of ItemService")
		return nil, err
	}
	s.Infra.Logger.For(ctx).Info("Successful repository update in Create rpc of ItemService")

	// // Read created model from repository
	// mc := new(pb.ItemServiceReadRequest)
	// model.MarshalCopyProto(req.Msg, mc)
	// whereClause, err := v1model.ItemProtoToWhereClause(mc)
	// if err != nil {
	// 	return nil, connect.NewError(connect.CodeUnavailable, errors.New("No userId or id sent with request"))
	// }
	// readm := v1model.Item{Id: insertm.Id}
	// if err := s.Infra.PgRepo.Item.Select(ctx, &readm, &whereClause); err != nil {
	// 	s.Infra.Logger.For(ctx).Info("Repository read error in Create rpc of ItemService")
	// 	return nil, err
	// }

	// // Convert created model to proto response
	// resm := readm.ItemToCreateResponse()

	resm := new(pb.ItemServiceCreateResponse)

	s.Infra.Logger.For(ctx).Info("Successful repository read in Create rpc of ItemService")
	return connect.NewResponse(resm), nil
}
