package item

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"cornucopia/listah/internal/pkg/utils"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
)

func (s *Server) ReadOne(ctx context.Context, req *connect.Request[v1.ItemServiceReadOneRequest]) (*connect.Response[v1.ItemServiceReadOneResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "read-one")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("ReadOne method in ItemService called")

	// Read model from repository
	readModel := model.ItemRead{Id: req.Msg.Id}
	if err := s.Infra.Repository.Item.SelectOne(ctx, &readModel, "id"); err != nil {
		return nil, err
	}

	// Convert model to generic (create) proto response
	genericResponse := readModel.ItemModelToResponse()

	// Marshal copy from generic response to read response
	responseModel := new(v1.ItemServiceReadOneResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}

func (s *Server) ReadMany(ctx context.Context, req *connect.Request[v1.ItemServiceReadManyRequest]) (*connect.Response[v1.ItemServiceReadManyResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "read-many")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("ReadMany method in ItemService called")

	// Read model from repository
	readModels := model.ItemsRead{}
	for _, val := range req.Msg.Item {
		readModels = append(readModels, &model.ItemRead{Id: val.Id})
	}
	if err := s.Infra.Repository.Item.SelectMany(ctx, &readModels, "id"); err != nil {
		return nil, err
	}

	// Convert model to generic (create) proto response
	genericResponse := readModels.ManyItemModelToResponse()

	// Marshal copy from generic response to read response
	responseModel := new(v1.ItemServiceReadManyResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}
