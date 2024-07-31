package item

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"cornucopia/listah/internal/pkg/utils"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
)

func (s *Server) DeleteOne(ctx context.Context, req *connect.Request[v1.ItemServiceDeleteOneRequest]) (*connect.Response[v1.ItemServiceDeleteOneResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "delete-one")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("DeleteOne method in ItemService called")

	// Read initial model from repository
	modelBeforeDelete := model.ItemRead{Id: req.Msg.Id}
	if err := s.Infra.Repository.Item.SelectOne(ctx, &modelBeforeDelete, "id"); err != nil {
		return nil, err
	}

	// Create model for update from information in request
	deleteModel := new(model.ItemWrite)
	deleteModel.DeleteOneItemModelFromRequest(req.Msg, &modelBeforeDelete)

	// Update model in repository
	if err := s.Infra.Repository.Item.SoftDeleteOne(ctx, deleteModel); err != nil {
		return nil, err
	}

	// Read model from repository after soft-delete
	modelAfterDelete := model.ItemRead{Id: req.Msg.Id}
	if err := s.Infra.Repository.Item.SelectOne(ctx, &modelAfterDelete, "id"); err != nil {
		return nil, err
	}

	// Convert model to generic (create response) proto message
	genericResponse := modelAfterDelete.ItemModelToResponse()

	// Marshal copy from generic (item create response) to response proto message
	responseModel := new(v1.ItemServiceDeleteOneResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}

func (s *Server) DeleteMany(ctx context.Context, req *connect.Request[v1.ItemServiceDeleteManyRequest]) (*connect.Response[v1.ItemServiceDeleteManyResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "delete-many")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("DeleteMany method in ItemService called")

	// Read initial model from repository
	readModels := model.ItemsRead{}
	for _, val := range req.Msg.Item {
		readModels = append(readModels, &model.ItemRead{Id: val.Id})
	}
	if err := s.Infra.Repository.Item.SelectMany(ctx, &readModels, "id"); err != nil {
		return nil, err
	}

	// Create model for update from request
	updateModels := model.DeleteManyItemModelFromRequest(req.Msg, &readModels)

	// Update model in repository
	if err := s.Infra.Repository.Item.SoftDeleteMany(ctx, updateModels); err != nil {
		return nil, err
	}

	// Read model from repository after update
	afterUpdateRead := model.ItemsRead{}
	for _, val := range req.Msg.Item {
		afterUpdateRead = append(afterUpdateRead, &model.ItemRead{Id: val.Id})
	}
	if err := s.Infra.Repository.Item.SelectMany(ctx, &afterUpdateRead, "id"); err != nil {
		return nil, err
	}

	// Convert model to generic (create response) proto message
	genericResponse := afterUpdateRead.ManyItemModelToResponse()

	// Marshal copy from generic (create response) to update response proto message
	responseModel := new(v1.ItemServiceDeleteManyResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}
