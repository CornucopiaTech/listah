package subSubCategory

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"cornucopia/listah/internal/pkg/utils"
	"log"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

func (s *Server) Create(ctx context.Context, req *connect.Request[v1.SubCategoryServiceCreateRequest]) (*connect.Response[v1.SubCategoryServiceCreateResponse], error) {
	ctx, span := otel.Tracer("subSubCategory-service").Start(ctx, "create")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Creating subSubCategory")

	// Get subSubCategory model for subSubCategory repository
	newSubCategoryModel := new(model.SubCategory)
	newSubCategoryModel.CreateSubCategoryModelFromRequest(ctx, req.Msg)

	// Inser subSubCategory model in repository
	if err := s.Infra.Repository.SubCategories.InsertOne(ctx, newSubCategoryModel); err != nil {
		return nil, err
	}

	// Read created subSubCategory model from repository
	readSubCategory, err := s.Infra.Repository.SubCategories.SelectOne(ctx, newSubCategoryModel.Id)
	if err != nil {
		return nil, err
	}

	// Convert created subSubCategory model to proto response
	resSubCategory := readSubCategory.SubCategoryModelToResponse(ctx)
	res := connect.NewResponse(resSubCategory)

	return res, nil
}

func (s *Server) Read(ctx context.Context, req *connect.Request[v1.SubCategoryServiceReadRequest]) (*connect.Response[v1.SubCategoryServiceReadResponse], error) {
	ctx, span := otel.Tracer("subSubCategory-service").Start(ctx, "read")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Reading subSubCategory", zap.String("subSubCategory", req.Msg.Id))

	// Read subSubCategory model from repository
	readSubCategory, err := s.Infra.Repository.SubCategories.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Convert subSubCategory model to generic (subSubCategory create) proto response
	genericResSubCategory := readSubCategory.SubCategoryModelToResponse(ctx)

	// Marshal copy from generic subSubCategory response to read subSubCategory response
	resSubCategory := new(v1.SubCategoryServiceReadResponse)
	utils.MarshalCopyProto(genericResSubCategory, resSubCategory)

	res := connect.NewResponse(resSubCategory)

	return res, nil
}

func (s *Server) Update(ctx context.Context, req *connect.Request[v1.SubCategoryServiceUpdateRequest]) (*connect.Response[v1.SubCategoryServiceUpdateResponse], error) {
	ctx, span := otel.Tracer("subSubCategory-service").Start(ctx, "update")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Updating subSubCategory", zap.String("subSubCategory", req.Msg.Id))

	// Read initial subSubCategory model from repository
	readSubCategory, err := s.Infra.Repository.SubCategories.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Create subSubCategory model for update from information sent in request
	updateSubCategoryModel := new(model.SubCategory)
	updateSubCategoryModel.UpdateSubCategoryModelFromRequest(ctx, req.Msg, readSubCategory)

	// Update SubCategory model in repository
	if err := s.Infra.Repository.SubCategories.UpdateOne(ctx, updateSubCategoryModel); err != nil {
		return nil, err
	}

	// Read subSubCategory model from repository after update
	readSubCategory, err = s.Infra.Repository.SubCategories.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Convert subSubCategory model to generic (subSubCategory create response) proto message
	genericResSubCategory := readSubCategory.SubCategoryModelToResponse(ctx)

	// Marshal copy from generic (subSubCategory create response) to update response proto message
	resSubCategory := new(v1.SubCategoryServiceUpdateResponse)

	utils.MarshalCopyProto(genericResSubCategory, resSubCategory)

	res := connect.NewResponse(resSubCategory)
	return res, nil
}

func (s *Server) Delete(ctx context.Context, req *connect.Request[v1.SubCategoryServiceDeleteRequest]) (*connect.Response[v1.SubCategoryServiceDeleteResponse], error) {
	ctx, span := otel.Tracer("subSubCategory-service").Start(ctx, "delete")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Deleting subSubCategory", zap.String("subSubCategory", req.Msg.Id))

	// Read initial subSubCategory model from repository
	readSubCategory, err := s.Infra.Repository.SubCategories.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Create subSubCategory model for update from information sent in request
	updateSubCategoryModel := new(model.SubCategory)
	updateSubCategoryModel.DeleteSubCategoryModelFromRequest(ctx, req.Msg, readSubCategory)

	// Update SubCategory model in repository
	if err := s.Infra.Repository.SubCategories.SoftDeleteOne(ctx, updateSubCategoryModel); err != nil {
		return nil, err
	}

	// Read subSubCategory model from repository after soft-delete
	readSubCategory, err = s.Infra.Repository.SubCategories.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Convert subSubCategory model to generic (subSubCategory create response) proto message
	genericResSubCategory := readSubCategory.SubCategoryModelToResponse(ctx)

	// Marshal copy from generic (subSubCategory create response) to update response proto message
	resSubCategory := new(v1.SubCategoryServiceDeleteResponse)

	utils.MarshalCopyProto(genericResSubCategory, resSubCategory)

	res := connect.NewResponse(resSubCategory)
	return res, nil
}

func (s *Server) Echo(ctx context.Context, req *connect.Request[v1.SubCategoryServiceCreateRequest]) (*connect.Response[v1.SubCategoryServiceCreateRequest], error) {
	// connect.Request and connect.Response give you direct access to headers and
	// trailers. No context-based nonsense!
	log.Println(req.Header().Get("Some-Header"))
	res := connect.NewResponse(&v1.SubCategoryServiceCreateRequest{
		// req.Msg is a strongly-typed *pingv1.PingRequest, so we can access its
		// fields without type assertions.
		Id:              req.Msg.Id,
		FirstName:       req.Msg.FirstName,
		MiddleNames:     req.Msg.MiddleNames,
		LastName:        req.Msg.LastName,
		SubCategoryname: req.Msg.SubCategoryname,
		Email:           req.Msg.Email,
		Role:            req.Msg.Role,
		Audit:           req.Msg.Audit,
	})
	res.Header().Set("Some-Other-Header", "hello!")
	return res, nil
}
