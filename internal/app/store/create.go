package store

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
)

func (s *Server) CreateOne(ctx context.Context, req *connect.Request[v1.StoreServiceCreateOneRequest]) (*connect.Response[v1.StoreServiceCreateOneResponse], error) {
	ctx, span := otel.Tracer("store-service").Start(ctx, "create-one")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("CreateOne method in StoreService called")

	// Create model for repository
	newModel := new(model.StoreWrite)
	newModel.CreateOneStoreModelFromRequest(req.Msg)

	// Insert model in repository
	if err := s.Infra.Repository.Store.InsertOne(ctx, newModel); err != nil {
		return nil, err
	}

	// Read created model from repository
	readModel := model.StoreRead{Id: newModel.Id}
	if err := s.Infra.Repository.Store.SelectOne(ctx, &readModel, "id"); err != nil {
		return nil, err
	}

	// Convert created model to proto response
	responseModel := readModel.StoreModelToResponse()

	return connect.NewResponse(responseModel), nil
}

func (s *Server) CreateMany(ctx context.Context, req *connect.Request[v1.StoreServiceCreateManyRequest]) (*connect.Response[v1.StoreServiceCreateManyResponse], error) {
	ctx, span := otel.Tracer("store-service").Start(ctx, "create-many")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("CreateMany method in StoreService called")

	// Create model for repository
	newModel := model.CreateManyStoreModelFromRequest(req.Msg)

	// Insert model in repository
	if err := s.Infra.Repository.Store.InsertMany(ctx, newModel); err != nil {
		return nil, err
	}

	// Read created model from repository
	readModel := model.StoresRead{}
	for _, val := range *newModel {
		readModel = append(readModel, &model.StoreRead{Id: val.Id})
	}
	if err := s.Infra.Repository.Store.SelectMany(ctx, &readModel, "id"); err != nil {
		return nil, err
	}

	// Convert created model to proto response
	resModel := readModel.ManyStoreModelToResponse()

	return connect.NewResponse(resModel), nil
}
