package category

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"cornucopia/listah/internal/pkg/utils"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
)

func (s *Server) DeleteOne(ctx context.Context, req *connect.Request[v1.CategoryServiceDeleteOneRequest]) (*connect.Response[v1.CategoryServiceDeleteOneResponse], error) {
	ctx, span := otel.Tracer("category-service").Start(ctx, "delete-one")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("DeleteOne method in CategoryService called")

	// Read initial model from repository
	modelBeforeDelete := model.Category{Id: req.Msg.Id}
	if err := s.Infra.Repository.Category.SelectOne(ctx, &modelBeforeDelete, "id"); err != nil {
		return nil, err
	}

	// Create model for update from information in request
	deleteModel := new(model.Category)
	deleteModel.DeleteOneCategoryModelFromRequest(req.Msg, &modelBeforeDelete)

	// Update model in repository
	if err := s.Infra.Repository.Category.SoftDeleteOne(ctx, deleteModel); err != nil {
		return nil, err
	}

	// Read model from repository after soft-delete
	modelAfterDelete := model.Category{Id: req.Msg.Id}
	if err := s.Infra.Repository.Category.SelectOne(ctx, &modelAfterDelete, "id"); err != nil {
		return nil, err
	}

	// Convert model to generic (create response) proto message
	genericResponse := modelAfterDelete.CategoryModelToResponse()

	// Marshal copy from generic (category create response) to response proto message
	responseModel := new(v1.CategoryServiceDeleteOneResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}

func (s *Server) DeleteMany(ctx context.Context, req *connect.Request[v1.CategoryServiceDeleteManyRequest]) (*connect.Response[v1.CategoryServiceDeleteManyResponse], error) {
	ctx, span := otel.Tracer("category-service").Start(ctx, "delete-many")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("DeleteMany method in CategoryService called")

	// Read initial model from repository
	readModels := model.Categories{}
	for _, val := range req.Msg.Category {
		readModels = append(readModels, &model.Category{Id: val.Id})
	}
	if err := s.Infra.Repository.Category.SelectMany(ctx, &readModels, "id"); err != nil {
		return nil, err
	}

	// Create model for update from request
	updateModels := model.DeleteManyCategoryModelFromRequest(req.Msg, &readModels)

	// Update model in repository
	if err := s.Infra.Repository.Category.SoftDeleteMany(ctx, updateModels); err != nil {
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
	responseModel := new(v1.CategoryServiceDeleteManyResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}
