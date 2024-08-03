package store

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"cornucopia/listah/internal/pkg/utils"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
)

func (s *Server) DeleteOne(ctx context.Context, req *connect.Request[v1.StoreServiceDeleteOneRequest]) (*connect.Response[v1.StoreServiceDeleteOneResponse], error) {
	ctx, span := otel.Tracer("store-service").Start(ctx, "delete-one")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("DeleteOne method in StoreService called")

	// Read initial model from repository
	modelBeforeDelete := model.StoreRead{Id: req.Msg.Id}
	if err := s.Infra.Repository.Store.SelectOne(ctx, &modelBeforeDelete, "id"); err != nil {
		return nil, err
	}

	// Create model for update from information in request
	deleteModel := new(model.StoreWrite)
	deleteModel.DeleteOneStoreModelFromRequest(req.Msg, &modelBeforeDelete)

	// Update model in repository
	if err := s.Infra.Repository.Store.SoftDeleteOne(ctx, deleteModel); err != nil {
		return nil, err
	}

	// Read model from repository after soft-delete
	modelAfterDelete := model.StoreRead{Id: req.Msg.Id}
	if err := s.Infra.Repository.Store.SelectOne(ctx, &modelAfterDelete, "id"); err != nil {
		return nil, err
	}

	// Convert model to generic (create response) proto message
	genericResponse := modelAfterDelete.StoreModelToResponse()

	// Marshal copy from generic (store create response) to response proto message
	responseModel := new(v1.StoreServiceDeleteOneResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}

func (s *Server) DeleteMany(ctx context.Context, req *connect.Request[v1.StoreServiceDeleteManyRequest]) (*connect.Response[v1.StoreServiceDeleteManyResponse], error) {
	ctx, span := otel.Tracer("store-service").Start(ctx, "delete-many")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("DeleteMany method in StoreService called")

	// Read initial model from repository
	readModels := model.StoresRead{}
	for _, val := range req.Msg.Store {
		readModels = append(readModels, &model.StoreRead{Id: val.Id})
	}
	if err := s.Infra.Repository.Store.SelectMany(ctx, &readModels, "id"); err != nil {
		return nil, err
	}

	// Create model for update from request
	updateModels := model.DeleteManyStoreModelFromRequest(req.Msg, &readModels)

	// Update model in repository
	if err := s.Infra.Repository.Store.SoftDeleteMany(ctx, updateModels); err != nil {
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
	responseModel := new(v1.StoreServiceDeleteManyResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}
