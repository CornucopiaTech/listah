package category

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	pb "cornucopia/listah/internal/pkg/proto/listah/v1"
	"cornucopia/listah/internal/pkg/utils"
	"log"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

func (s *Server) Create(ctx context.Context, req *connect.Request[pb.CategoryServiceCreateRequest]) (*connect.Response[pb.CategoryServiceCreateResponse], error) {
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

func (s *Server) Read(ctx context.Context, req *connect.Request[pb.CategoryServiceReadRequest]) (*connect.Response[pb.CategoryServiceReadResponse], error) {
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
	resCategory := new(pb.CategoryServiceReadResponse)
	utils.MarshalCopyProto(genericResCategory, resCategory)

	res := connect.NewResponse(resCategory)

	return res, nil
}

func (s *Server) Update(ctx context.Context, req *connect.Request[pb.CategoryServiceUpdateRequest]) (*connect.Response[pb.CategoryServiceUpdateResponse], error) {
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
	resCategory := new(pb.CategoryServiceUpdateResponse)

	utils.MarshalCopyProto(genericResCategory, resCategory)

	res := connect.NewResponse(resCategory)
	return res, nil
}

func (s *Server) Delete(ctx context.Context, req *connect.Request[pb.CategoryServiceDeleteRequest]) (*connect.Response[pb.CategoryServiceDeleteResponse], error) {
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
	resCategory := new(pb.CategoryServiceDeleteResponse)

	utils.MarshalCopyProto(genericResCategory, resCategory)

	res := connect.NewResponse(resCategory)
	return res, nil
}

func (s *Server) Echo(ctx context.Context, req *connect.Request[pb.CategoryServiceCreateRequest]) (*connect.Response[pb.CategoryServiceCreateRequest], error) {
	// connect.Request and connect.Response give you direct access to headers and
	// trailers. No context-based nonsense!
	log.Println(req.Header().Get("Some-Header"))
	res := connect.NewResponse(&pb.CategoryServiceCreateRequest{
		// req.Msg is a strongly-typed *pingv1.PingRequest, so we can access its
		// fields without type assertions.
		Id:           req.Msg.Id,
		FirstName:    req.Msg.FirstName,
		MiddleNames:  req.Msg.MiddleNames,
		LastName:     req.Msg.LastName,
		Categoryname: req.Msg.Categoryname,
		Email:        req.Msg.Email,
		Role:         req.Msg.Role,
		Audit:        req.Msg.Audit,
	})
	res.Header().Set("Some-Other-Header", "hello!")
	return res, nil
}
