package item

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"cornucopia/listah/internal/pkg/utils"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
)

func (s *Server) ReadOne(ctx context.Context, req *connect.Request[v1.ItemServiceReadOneRequest]) (*connect.Response[v1.ItemServiceReadOneResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "read-one")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("ReadOne method in ItemService called")

	// Read created model from repository
	readModel := new(model.Item)
	readFilter := map[string]string{"_id": req.Msg.Id}
	if err := s.Infra.Repository.Item.ReadOne(ctx, readModel, readFilter); err != nil {
		s.Infra.Logger.For(ctx).Info("Writing response after erroneous reading")
		// return prepOneResponse(readModel)
	} else {
		s.Infra.Logger.For(ctx).Info("Writing response after successful reading")
	}

	// Convert model to generic (create) proto response
	genericResponse := readModel.ItemModelToResponse()

	// Marshal copy from generic response to read response
	responseModel := new(v1.ItemServiceReadOneResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}
func prepOneResponse(readOneModel model.Item) (*connect.Response[v1.ItemServiceReadOneResponse], error) {
	// Convert model to generic (create) proto response
	genericResponse := readOneModel.ItemModelToResponse()

	// Marshal copy from generic response to read response
	responseModel := new(v1.ItemServiceReadOneResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)
	return connect.NewResponse(responseModel), nil
}

func (s *Server) ReadMany(ctx context.Context, req *connect.Request[v1.ItemServiceReadManyRequest]) (*connect.Response[v1.ItemServiceReadManyResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "read-many")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("ReadMany method in ItemService called")

	// Read model from repository
	readModel := new(model.Items)


	// Read recently added document into database
	readFilter := map[string] map[string] []string{
		"_id": {"$in": req.Msg.Ids},
	}


	if err := s.Infra.Repository.Item.ReadMany(ctx, readModel, readFilter); err != nil {
		s.Infra.Logger.For(ctx).Info("Writing response after erroneous reading")
	} else {
			s.Infra.Logger.For(ctx).Info("Writing response after successful reading")
	}

	// Convert model to generic (create) proto response
	genericResponse := readModel.ManyItemModelToResponse()

	// Marshal copy from generic response to read response
	responseModel := new(v1.ItemServiceReadManyResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}
