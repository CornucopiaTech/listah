package item

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"

	"connectrpc.com/connect"
	"go.mongodb.org/mongo-driver/bson"
	"go.opentelemetry.io/otel"
)

func (s *Server) CreateOne(ctx context.Context, req *connect.Request[v1.ItemServiceCreateOneRequest]) (*connect.Response[v1.ItemServiceCreateOneResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "create-one")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("CreateOne method in ItemService called")

	// Create model for repository
	newModel := new(model.Item)
	newModel.CreateOneItemModelFromRequest(req.Msg)

	// Read created model from repository
	readModel := new(model.Item)

	// Insert model in repository
	insertedID, _ := s.Infra.Repository.Item.InsertOne(ctx, newModel)
	if insertedID == "" {
		s.Infra.Logger.For(ctx).Info("Writing response after erroneous insertion")
		responseModel := readModel.ItemModelToResponse()
		return connect.NewResponse(responseModel), nil
	}

	readModel.Id = insertedID
	readFilter := bson.D{{"_id", insertedID}}
	if err := s.Infra.Repository.Item.ReadOne(ctx, readModel, readFilter); err != nil {
		s.Infra.Logger.For(ctx).Info("Writing response after erroneous reading after successful insertion")
		responseModel := readModel.ItemModelToResponse()
		return connect.NewResponse(responseModel), nil
	}

	// Convert created model to proto response
	responseModel := readModel.ItemModelToResponse()
	s.Infra.Logger.For(ctx).Info("Writing response after successful insertion")
	return connect.NewResponse(responseModel), nil
}

// func (s *Server) CreateMany(ctx context.Context, req *connect.Request[v1.ItemServiceCreateManyRequest]) (*connect.Response[v1.ItemServiceCreateManyResponse], error) {
// 	ctx, span := otel.Tracer("item-service").Start(ctx, "create-many")
// 	defer span.End()
// 	s.Infra.Logger.For(ctx).Info("CreateMany method in ItemService called")

// 	// Create model for repository
// 	newModel := model.CreateManyItemModelFromRequest(req.Msg)

// 	// Insert model in repository
// 	if err := s.Infra.Repository.Item.InsertMany(ctx, newModel); err != nil {
// 		return nil, err
// 	}

// 	// Read created model from repository
// 	readModel := model.ItemsRead{}
// 	for _, val := range *newModel {
// 		readModel = append(readModel, &model.ItemRead{Id: val.Id})
// 	}
// 	if err := s.Infra.Repository.Item.SelectMany(ctx, &readModel, "id"); err != nil {
// 		return nil, err
// 	}

// 	// Convert created model to proto response
// 	resModel := readModel.ManyItemModelToResponse()

// 	return connect.NewResponse(resModel), nil
// }
