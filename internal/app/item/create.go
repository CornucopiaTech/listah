package item

import (
	"context"
	// "strings"
	"fmt"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"

	"connectrpc.com/connect"
	// "go.mongodb.org/mongo-driver/bson"
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

	// Read recently added document into database
	readModel.Id = insertedID
	readFilter := map[string]string{"_id": insertedID}
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

func (s *Server) CreateMany(ctx context.Context, req *connect.Request[v1.ItemServiceCreateManyRequest]) (*connect.Response[v1.ItemServiceCreateManyResponse], error) {
	ctx, span := otel.Tracer("item-service").Start(ctx, "create-many")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("CreateMany method in ItemService called")

	// Create model for repository
	newModel := model.CreateManyItemModelFromRequest(req.Msg)
	fmt.Printf("Value of new model: %v", newModel)


	// Read created model from repository
	readModel := new(model.Items)

	// Insert model in repository
	insertedIDs, err := s.Infra.Repository.Item.InsertMany(ctx, newModel)
	fmt.Printf("Value of insertedIds %v and %T", insertedIDs, insertedIDs)
	if err != nil {
		s.Infra.Logger.For(ctx).Info("Writing response after erroneous insertion")
		resModel := readModel.ManyItemModelToResponse()
		return connect.NewResponse(resModel), nil
	}

	// if strings.Join(insertedIDs, "") == "" {
	// 	s.Infra.Logger.For(ctx).Info("Writing response after erroneous insertion")
	// 	responseModel := readModel.ManyItemModelToResponse()
	// 	return connect.NewResponse(responseModel), nil
	// }
	// readFilter := make(map[string][]string)

	// // Read recently added document into database
	// for _, val := range *newModel {
	// 	readModel = append(readModel, &model.Item{Id: val.Id})
	// 	readFilter["_id"] = append(readFilter["_id"], val.Id)
	// }
	// if err := s.Infra.Repository.Item.ReadOne(ctx, readModel, readFilter); err != nil {
	// 	s.Infra.Logger.For(ctx).Info("Writing response after erroneous reading after successful insertion")
	// 	responseModel := readModel.ManyItemModelToResponse()
	// 	return connect.NewResponse(responseModel), nil
	// }


	// Convert created model to proto response
	resModel := readModel.ManyItemModelToResponse()
	s.Infra.Logger.For(ctx).Info("Writing response after successful insertion")
	return connect.NewResponse(resModel), nil
}
