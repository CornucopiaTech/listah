package item

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

func (s *Server) Create(ctx context.Context, req *connect.Request[pb.ItemServiceCreateRequest]) (*connect.Response[pb.ItemServiceCreateResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "create")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Creating item")

	// Get item model for item repository
	newItemModel := new(model.Item)
	newItemModel.CreateItemModelFromRequest(ctx, req.Msg)

	// Inser item model in repository
	if err := s.Infra.Repository.Items.InsertOne(ctx, newItemModel); err != nil {
		return nil, err
	}

	// Read created item model from repository
	readItem, err := s.Infra.Repository.Items.SelectOne(ctx, newItemModel.Id)
	if err != nil {
		return nil, err
	}

	// Convert created item model to proto response
	resItem := readItem.ItemModelToResponse(ctx)
	res := connect.NewResponse(resItem)

	return res, nil
}

func (s *Server) Read(ctx context.Context, req *connect.Request[pb.ItemServiceReadRequest]) (*connect.Response[pb.ItemServiceReadResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "read")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Reading item", zap.String("item", req.Msg.Id))

	// Read item model from repository
	readItem, err := s.Infra.Repository.Items.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Convert item model to generic (item create) proto response
	genericResItem := readItem.ItemModelToResponse(ctx)

	// Marshal copy from generic item response to read item response
	resItem := new(pb.ItemServiceReadResponse)
	utils.MarshalCopyProto(genericResItem, resItem)

	res := connect.NewResponse(resItem)

	return res, nil
}

func (s *Server) Update(ctx context.Context, req *connect.Request[pb.ItemServiceUpdateRequest]) (*connect.Response[pb.ItemServiceUpdateResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "update")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Updating item", zap.String("item", req.Msg.Id))

	// Read initial item model from repository
	readItem, err := s.Infra.Repository.Items.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Create item model for update from information sent in request
	updateItemModel := new(model.Item)
	updateItemModel.UpdateItemModelFromRequest(ctx, req.Msg, readItem)

	// Update Item model in repository
	if err := s.Infra.Repository.Items.UpdateOne(ctx, updateItemModel); err != nil {
		return nil, err
	}

	// Read item model from repository after update
	readItem, err = s.Infra.Repository.Items.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Convert item model to generic (item create response) proto message
	genericResItem := readItem.ItemModelToResponse(ctx)

	// Marshal copy from generic (item create response) to update response proto message
	resItem := new(pb.ItemServiceUpdateResponse)

	utils.MarshalCopyProto(genericResItem, resItem)

	res := connect.NewResponse(resItem)
	return res, nil
}

func (s *Server) Delete(ctx context.Context, req *connect.Request[pb.ItemServiceDeleteRequest]) (*connect.Response[pb.ItemServiceDeleteResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "delete")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Deleting item", zap.String("item", req.Msg.Id))

	// Read initial item model from repository
	readItem, err := s.Infra.Repository.Items.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Create item model for update from information sent in request
	updateItemModel := new(model.Item)
	updateItemModel.DeleteItemModelFromRequest(ctx, req.Msg, readItem)

	// Update Item model in repository
	if err := s.Infra.Repository.Items.SoftDeleteOne(ctx, updateItemModel); err != nil {
		return nil, err
	}

	// Read item model from repository after soft-delete
	readItem, err = s.Infra.Repository.Items.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Convert item model to generic (item create response) proto message
	genericResItem := readItem.ItemModelToResponse(ctx)

	// Marshal copy from generic (item create response) to update response proto message
	resItem := new(pb.ItemServiceDeleteResponse)

	utils.MarshalCopyProto(genericResItem, resItem)

	res := connect.NewResponse(resItem)
	return res, nil
}

func (s *Server) Echo(ctx context.Context, req *connect.Request[pb.ItemServiceCreateRequest]) (*connect.Response[pb.ItemServiceCreateRequest], error) {
	// connect.Request and connect.Response give you direct access to headers and
	// trailers. No context-based nonsense!
	log.Println(req.Header().Get("Some-Header"))
	res := connect.NewResponse(&pb.ItemServiceCreateRequest{})
	res.Header().Set("Some-Other-Header", "hello!")
	return res, nil
}
