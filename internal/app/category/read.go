package category

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"cornucopia/listah/internal/pkg/utils"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
)

func (s *Server) ReadOne(ctx context.Context, req *connect.Request[v1.CategoryServiceReadOneRequest]) (*connect.Response[v1.CategoryServiceReadOneResponse], error) {
	ctx, span := otel.Tracer("category-service").Start(ctx, "read-one")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("ReadOne method in CategoryService called")

	// Read model from repository
	readModel := model.Category{Id: req.Msg.Id}
	if err := s.Infra.Repository.Category.SelectOne(ctx, &readModel, "id"); err != nil {
		return nil, err
	}

	// Convert model to generic (create) proto response
	genericResponse := readModel.CategoryModelToResponse()

	// Marshal copy from generic response to read response
	responseModel := new(v1.CategoryServiceReadOneResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}

func (s *Server) ReadMany(ctx context.Context, req *connect.Request[v1.CategoryServiceReadManyRequest]) (*connect.Response[v1.CategoryServiceReadManyResponse], error) {
	ctx, span := otel.Tracer("category-service").Start(ctx, "read-many")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("ReadMany method in CategoryService called")

	// Read model from repository
	readModels := model.Categories{}
	for _, val := range req.Msg.Category {
		readModels = append(readModels, &model.Category{Id: val.Id})
	}
	if err := s.Infra.Repository.Category.SelectMany(ctx, &readModels, "id"); err != nil {
		return nil, err
	}

	// Convert model to generic (create) proto response
	genericResponse := readModels.ManyCategoryModelToResponse()

	// Marshal copy from generic response to read response
	responseModel := new(v1.CategoryServiceReadManyResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}
