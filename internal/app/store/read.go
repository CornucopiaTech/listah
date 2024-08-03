package store

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"cornucopia/listah/internal/pkg/utils"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
)

func (s *Server) ReadOne(ctx context.Context, req *connect.Request[v1.StoreServiceReadOneRequest]) (*connect.Response[v1.StoreServiceReadOneResponse], error) {
	ctx, span := otel.Tracer("store-service").Start(ctx, "read-one")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("ReadOne method in StoreService called")

	// Read model from repository
	readModel := model.StoreRead{Id: req.Msg.Id}
	if err := s.Infra.Repository.Store.SelectOne(ctx, &readModel, "id"); err != nil {
		return nil, err
	}

	// Convert model to generic (create) proto response
	genericResponse := readModel.StoreModelToResponse()

	// Marshal copy from generic response to read response
	responseModel := new(v1.StoreServiceReadOneResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}

func (s *Server) ReadMany(ctx context.Context, req *connect.Request[v1.StoreServiceReadManyRequest]) (*connect.Response[v1.StoreServiceReadManyResponse], error) {
	ctx, span := otel.Tracer("store-service").Start(ctx, "read-many")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("ReadMany method in StoreService called")

	// Read model from repository
	readModels := model.StoresRead{}
	for _, val := range req.Msg.Store {
		readModels = append(readModels, &model.StoreRead{Id: val.Id})
	}
	if err := s.Infra.Repository.Store.SelectMany(ctx, &readModels, "id"); err != nil {
		return nil, err
	}

	// Convert model to generic (create) proto response
	genericResponse := readModels.ManyStoreModelToResponse()

	// Marshal copy from generic response to read response
	responseModel := new(v1.StoreServiceReadManyResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}
