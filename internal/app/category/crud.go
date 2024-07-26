package category

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"cornucopia/listah/internal/pkg/utils"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

func (s *Server) Create(ctx context.Context, req *connect.Request[v1.CategoryServiceCreateRequest]) (*connect.Response[v1.CategoryServiceCreateResponse], error) {
	ctx, span := otel.Tracer("category-service").Start(ctx, "create")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Creating category")

	// Get category model for category repository
	newCategoryModel := new(model.Category)
	newCategoryModel.CreateCategoryModelFromRequest(ctx, req.Msg)

	// Inser category model in repository
	if err := s.Infra.Repository.Categories.InsertOne(ctx, newCategoryModel); err != nil {
		return nil, err
	}

	// Read created category model from repository
	readCategory, err := s.Infra.Repository.Categories.SelectOne(ctx, newCategoryModel.Id)
	if err != nil {
		return nil, err
	}

	// Convert created category model to proto response
	resCategory := readCategory.CategoryModelToResponse(ctx)
	res := connect.NewResponse(resCategory)

	return res, nil
}

func (s *Server) Read(ctx context.Context, req *connect.Request[v1.CategoryServiceReadRequest]) (*connect.Response[v1.CategoryServiceReadResponse], error) {
	ctx, span := otel.Tracer("category-service").Start(ctx, "read")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Reading category", zap.String("category", req.Msg.Id))

	// Read category model from repository
	readCategory, err := s.Infra.Repository.Categories.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Convert category model to generic (category create) proto response
	genericResCategory := readCategory.CategoryModelToResponse(ctx)

	// Marshal copy from generic category response to read category response
	resCategory := new(v1.CategoryServiceReadResponse)
	utils.MarshalCopyProto(genericResCategory, resCategory)

	res := connect.NewResponse(resCategory)

	return res, nil
}

func (s *Server) Update(ctx context.Context, req *connect.Request[v1.CategoryServiceUpdateRequest]) (*connect.Response[v1.CategoryServiceUpdateResponse], error) {
	ctx, span := otel.Tracer("category-service").Start(ctx, "update")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Updating category", zap.String("category", req.Msg.Id))

	// Read initial category model from repository
	readCategory, err := s.Infra.Repository.Categories.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Create category model for update from information sent in request
	updateCategoryModel := new(model.Category)
	updateCategoryModel.UpdateCategoryModelFromRequest(ctx, req.Msg, readCategory)

	// Update Category model in repository
	if err := s.Infra.Repository.Categories.UpdateOne(ctx, updateCategoryModel); err != nil {
		return nil, err
	}

	// Read category model from repository after update
	readCategory, err = s.Infra.Repository.Categories.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Convert category model to generic (category create response) proto message
	genericResCategory := readCategory.CategoryModelToResponse(ctx)

	// Marshal copy from generic (category create response) to update response proto message
	resCategory := new(v1.CategoryServiceUpdateResponse)

	utils.MarshalCopyProto(genericResCategory, resCategory)

	res := connect.NewResponse(resCategory)
	return res, nil
}

func (s *Server) Delete(ctx context.Context, req *connect.Request[v1.CategoryServiceDeleteRequest]) (*connect.Response[v1.CategoryServiceDeleteResponse], error) {
	ctx, span := otel.Tracer("category-service").Start(ctx, "delete")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Deleting category", zap.String("category", req.Msg.Id))

	// Read initial category model from repository
	readCategory, err := s.Infra.Repository.Categories.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Create category model for update from information sent in request
	updateCategoryModel := new(model.Category)
	updateCategoryModel.DeleteCategoryModelFromRequest(ctx, req.Msg, readCategory)

	// Update Category model in repository
	if err := s.Infra.Repository.Categories.SoftDeleteOne(ctx, updateCategoryModel); err != nil {
		return nil, err
	}

	// Read category model from repository after soft-delete
	readCategory, err = s.Infra.Repository.Categories.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Convert category model to generic (category create response) proto message
	genericResCategory := readCategory.CategoryModelToResponse(ctx)

	// Marshal copy from generic (category create response) to update response proto message
	resCategory := new(v1.CategoryServiceDeleteResponse)

	utils.MarshalCopyProto(genericResCategory, resCategory)

	res := connect.NewResponse(resCategory)
	return res, nil
}
