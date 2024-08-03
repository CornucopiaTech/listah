package store

import (
	"context"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"

	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"cornucopia/listah/internal/pkg/utils"
)

func (s *Server) UpdateOne(ctx context.Context, req *connect.Request[v1.StoreServiceUpdateOneRequest]) (*connect.Response[v1.StoreServiceUpdateOneResponse], error) {
	ctx, span := otel.Tracer("store-service").Start(ctx, "update-one")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("UpdateOne method in StoreService called")

	// panic("Implement me!")

	// Read initial model from repository
	readModel := model.StoreRead{Id: req.Msg.Id}
	if err := s.Infra.Repository.Store.SelectOne(ctx, &readModel, "id"); err != nil {
		return nil, err
	}

	// Create model for update from request
	updateModel := new(model.StoreWrite)
	updateModel.UpdateOneStoreModelFromRequest(req.Msg, &readModel)

	// Update model in repository
	if err := s.Infra.Repository.Store.UpdateOne(ctx, updateModel); err != nil {
		return nil, err
	}

	// Read model from repository after update
	afterUpdateRead := model.StoreRead{Id: req.Msg.Id}
	if err := s.Infra.Repository.Store.SelectOne(ctx, &afterUpdateRead, "id"); err != nil {
		return nil, err
	}

	// Convert model to generic (create response) proto message
	genericResponse := afterUpdateRead.StoreModelToResponse()

	// Marshal copy from generic (create response) to update response proto message
	responseModel := new(v1.StoreServiceUpdateOneResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}

func (s *Server) UpdateMany(ctx context.Context, req *connect.Request[v1.StoreServiceUpdateManyRequest]) (*connect.Response[v1.StoreServiceUpdateManyResponse], error) {
	ctx, span := otel.Tracer("store-service").Start(ctx, "update-many")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("UpdateMany method in StoreService called")

	// Read initial model from repository
	readModels := model.StoresRead{}
	for _, val := range req.Msg.Store {
		readModels = append(readModels, &model.StoreRead{Id: val.Id})
	}
	if err := s.Infra.Repository.Store.SelectMany(ctx, &readModels, "id"); err != nil {
		return nil, err
	}

	// Create model for update from request
	updateModels := model.UpdateManyStoreModelFromRequest(req.Msg, &readModels)

	// Update model in repository
	if err := s.Infra.Repository.Store.UpdateMany(ctx, updateModels); err != nil {
		return nil, err
	}

	// Read model from repository after update
	afterUpdateRead := model.StoresRead{}
	for _, val := range req.Msg.Store {
		afterUpdateRead = append(afterUpdateRead, &model.StoreRead{Id: val.Id})
	}
	if err := s.Infra.Repository.Store.SelectMany(ctx, &afterUpdateRead, "id"); err != nil {
		return nil, err
	}

	// Convert model to generic (create response) proto message
	genericResponse := afterUpdateRead.ManyStoreModelToResponse()

	// Marshal copy from generic (create response) to update response proto message
	responseModel := new(v1.StoreServiceUpdateManyResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}
