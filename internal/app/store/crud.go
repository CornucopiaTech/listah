package store

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"cornucopia/listah/internal/pkg/utils"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

func (s *Server) Create(ctx context.Context, req *connect.Request[v1.StoreServiceCreateOneRequest]) (*connect.Response[v1.StoreServiceCreateOneResponse], error) {
	ctx, span := otel.Tracer("store-service").Start(ctx, "create")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Creating store")

	// Get category information
	readCategoryModel := model.Category{Name: req.Msg.Category}
	readCategory, err := s.Infra.Repository.Store.Select(ctx, &readCategoryModel)

	// Get store model for store repository
	newStoreModel := new(model.Store)
	newStoreModel.CreateStoreModelFromRequest(ctx, req.Msg)

	// Inser store model in repository
	if err := s.Infra.Repository.Store.InsertOne(ctx, newStoreModel); err != nil {
		return nil, err
	}

	// Read created store model from repository
	readStore, err := s.Infra.Repository.Store.SelectOne(ctx, newStoreModel.Id)
	if err != nil {
		return nil, err
	}

	// Convert created store model to proto response
	resStore := readStore.StoreModelToResponse(ctx)
	res := connect.NewResponse(resStore)

	return res, nil
}

func (s *Server) CreateMany(ctx context.Context, req *connect.Request[v1.StoreServiceCreateManyRequest]) (*connect.Response[v1.StoreServiceCreateManyResponse], error) {
	ctx, span := otel.Tracer("store-service").Start(ctx, "create-many")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Creating many in store")

	// Get store model for store repository
	newStoreModel := model.CreateManyStoreModelFromRequest(ctx, req.Msg)

	// Insert store model in repository
	if err := s.Infra.Repository.Store.InsertMany(ctx, newStoreModel); err != nil {
		return nil, err
	}

	// Read created store model from repository
	ids := model.Stores{}
	for _, val := range *newStoreModel {
		ids = append(ids, &model.Store{Id: val.Id})
	}

	readStore, err := s.Infra.Repository.Store.SelectMany(ctx, &ids)
	if err != nil {
		return nil, err
	}

	// Convert created store model to proto response
	resStore := readStore.ManyStoreModelToResponse(ctx)
	res := connect.NewResponse(resStore)

	return res, nil
}

func (s *Server) Read(ctx context.Context, req *connect.Request[v1.StoreServiceReadOneRequest]) (*connect.Response[v1.StoreServiceReadOneResponse], error) {
	ctx, span := otel.Tracer("store-service").Start(ctx, "read")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Reading store", zap.String("store", req.Msg.Id))

	// Read store model from repository
	readStore, err := s.Infra.Repository.Store.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Convert store model to generic (store create) proto response
	genericResStore := readStore.StoreModelToResponse(ctx)

	// Marshal copy from generic store response to read store response
	resStore := new(v1.StoreServiceReadOneResponse)
	utils.MarshalCopyProto(genericResStore, resStore)

	res := connect.NewResponse(resStore)

	return res, nil
}

func (s *Server) Update(ctx context.Context, req *connect.Request[v1.StoreServiceUpdateOneRequest]) (*connect.Response[v1.StoreServiceUpdateOneResponse], error) {
	ctx, span := otel.Tracer("store-service").Start(ctx, "update")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Updating store", zap.String("store", req.Msg.Id))

	// Read initial store model from repository
	readStore, err := s.Infra.Repository.Store.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Create store model for update from information sent in request
	updateStoreModel := new(model.Store)
	updateStoreModel.UpdateStoreModelFromRequest(ctx, req.Msg, readStore)

	// Update Store model in repository
	if err := s.Infra.Repository.Store.UpdateOne(ctx, updateStoreModel); err != nil {
		return nil, err
	}

	// Read store model from repository after update
	readStore, err = s.Infra.Repository.Store.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Convert store model to generic (store create response) proto message
	genericResStore := readStore.StoreModelToResponse(ctx)

	// Marshal copy from generic (store create response) to update response proto message
	resStore := new(v1.StoreServiceUpdateOneResponse)

	utils.MarshalCopyProto(genericResStore, resStore)

	res := connect.NewResponse(resStore)
	return res, nil
}

func (s *Server) Delete(ctx context.Context, req *connect.Request[v1.StoreServiceDeleteOneRequest]) (*connect.Response[v1.StoreServiceDeleteOneResponse], error) {
	ctx, span := otel.Tracer("store-service").Start(ctx, "delete")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Deleting store", zap.String("store", req.Msg.Id))

	// Read initial store model from repository
	readStore, err := s.Infra.Repository.Store.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Create store model for update from information sent in request
	updateStoreModel := new(model.Store)
	updateStoreModel.DeleteStoreModelFromRequest(ctx, req.Msg, readStore)

	// Update Store model in repository
	if err := s.Infra.Repository.Store.SoftDeleteOne(ctx, updateStoreModel); err != nil {
		return nil, err
	}

	// Read store model from repository after soft-delete
	readStore, err = s.Infra.Repository.Store.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Convert store model to generic (store create response) proto message
	genericResStore := readStore.StoreModelToResponse(ctx)

	// Marshal copy from generic (store create response) to update response proto message
	resStore := new(v1.StoreServiceDeleteOneResponse)

	utils.MarshalCopyProto(genericResStore, resStore)

	res := connect.NewResponse(resStore)
	return res, nil
}
