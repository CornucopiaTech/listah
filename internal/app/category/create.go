package category

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
)

func (s *Server) CreateOne(ctx context.Context, req *connect.Request[v1.CategoryServiceCreateOneRequest]) (*connect.Response[v1.CategoryServiceCreateOneResponse], error) {
	ctx, span := otel.Tracer("category-service").Start(ctx, "create-one")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("CreateOne method in CategoryService called")

	// Create model for repository
	newModel := new(model.Category)
	newModel.CreateOneCategoryModelFromRequest(req.Msg)

	// Insert model in repository
	if err := s.Infra.Repository.Category.InsertOne(ctx, newModel); err != nil {
		return nil, err
	}

	// Read created model from repository
	readModel := model.Category{Id: newModel.Id}
	if err := s.Infra.Repository.Category.SelectOne(ctx, &readModel, "id"); err != nil {
		return nil, err
	}

	// Convert created model to proto response
	responseModel := readModel.CategoryModelToResponse()

	return connect.NewResponse(responseModel), nil
}

func (s *Server) CreateMany(ctx context.Context, req *connect.Request[v1.CategoryServiceCreateManyRequest]) (*connect.Response[v1.CategoryServiceCreateManyResponse], error) {
	ctx, span := otel.Tracer("category-service").Start(ctx, "create-many")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("CreateMany method in CategoryService called")

	// Create model for repository
	newModel := model.CreateManyCategoryModelFromRequest(req.Msg)

	// Insert model in repository
	if err := s.Infra.Repository.Category.InsertMany(ctx, newModel); err != nil {
		return nil, err
	}

	// Read created model from repository
	readModel := model.Categories{}
	for _, val := range *newModel {
		readModel = append(readModel, &model.Category{Id: val.Id})
	}
	if err := s.Infra.Repository.Category.SelectMany(ctx, &readModel, "id"); err != nil {
		return nil, err
	}

	// Convert created model to proto response
	resModel := readModel.ManyCategoryModelToResponse()

	return connect.NewResponse(resModel), nil
}
