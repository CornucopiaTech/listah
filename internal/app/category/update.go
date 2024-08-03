package category

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"cornucopia/listah/internal/pkg/utils"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
)

func (s *Server) UpdateOne(ctx context.Context, req *connect.Request[v1.CategoryServiceUpdateOneRequest]) (*connect.Response[v1.CategoryServiceUpdateOneResponse], error) {
	ctx, span := otel.Tracer("category-service").Start(ctx, "update-one")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("UpdateOne method in CategoryService called")

	// Read initial model from repository
	readModel := model.Category{Id: req.Msg.Id}
	if err := s.Infra.Repository.Category.SelectOne(ctx, &readModel, "id"); err != nil {
		return nil, err
	}

	// Create model for update from request
	updateModel := new(model.Category)
	updateModel.UpdateOneCategoryModelFromRequest(req.Msg, &readModel)

	// Update model in repository
	if err := s.Infra.Repository.Category.UpdateOne(ctx, updateModel); err != nil {
		return nil, err
	}

	// Read model from repository after update
	afterUpdateRead := model.Category{Id: req.Msg.Id}
	if err := s.Infra.Repository.Category.SelectOne(ctx, &afterUpdateRead, "id"); err != nil {
		return nil, err
	}

	// Convert model to generic (create response) proto message
	genericResponse := afterUpdateRead.CategoryModelToResponse()

	// Marshal copy from generic (create response) to update response proto message
	responseModel := new(v1.CategoryServiceUpdateOneResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}

func (s *Server) UpdateMany(ctx context.Context, req *connect.Request[v1.CategoryServiceUpdateManyRequest]) (*connect.Response[v1.CategoryServiceUpdateManyResponse], error) {
	ctx, span := otel.Tracer("category-service").Start(ctx, "update-many")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("UpdateMany method in CategoryService called")

	// Read initial model from repository
	readModels := model.Categories{}
	for _, val := range req.Msg.Category {
		readModels = append(readModels, &model.Category{Id: val.Id})
	}
	if err := s.Infra.Repository.Category.SelectMany(ctx, &readModels, "id"); err != nil {
		return nil, err
	}

	// Create model for update from request
	updateModels := model.UpdateManyCategoryModelFromRequest(req.Msg, &readModels)

	// Update model in repository
	if err := s.Infra.Repository.Category.UpdateMany(ctx, updateModels); err != nil {
		return nil, err
	}

	// Read model from repository after update
	afterUpdateRead := model.Categories{}
	for _, val := range req.Msg.Category {
		afterUpdateRead = append(afterUpdateRead, &model.Category{Id: val.Id})
	}
	if err := s.Infra.Repository.Category.SelectMany(ctx, &afterUpdateRead, "id"); err != nil {
		return nil, err
	}

	// Convert model to generic (create response) proto message
	genericResponse := afterUpdateRead.ManyCategoryModelToResponse()

	// Marshal copy from generic (create response) to update response proto message
	responseModel := new(v1.CategoryServiceUpdateManyResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}
