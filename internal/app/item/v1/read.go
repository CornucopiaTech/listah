package v1

import (
	"context"
	util "cornucopia/listah/internal/pkg/model"
	v1model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
	"errors"
)

func (s *Server) Read(ctx context.Context, req *connect.Request[pb.ItemServiceReadRequest]) (*connect.Response[pb.ItemServiceReadResponse], error) {
	ctx, span := otel.Tracer("plaidlink-service").Start(ctx, "read")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("Read rpc in ItemService called")

	// Read model from repository
	readm := v1model.Item{}

	// Construct where clause from request
	whereClause, err := v1model.ItemProtoToWhereClause(req.Msg)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnavailable, errors.New("No userId sent with request"))
	}


	if err := s.Infra.PgRepo.Item.Select(ctx, &readm, &whereClause); err != nil {
		s.Infra.Logger.For(ctx).Info("Repository read error in Read rpc of ItemService")
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	// Convert readd model to proto response
	g := readm.ItemToCreateResponse()
	resp := new(pb.ItemServiceReadResponse)
	util.MarshalCopyProto(g, resp)

	s.Infra.Logger.For(ctx).Info("Successful repository read in Read rpc of ItemService")
	return connect.NewResponse(resp), nil
}
