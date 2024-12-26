package item

// import (
// 	"context"

// 	"connectrpc.com/connect"
// 	"go.opentelemetry.io/otel"

// 	"cornucopia/listah/internal/pkg/model"
// 	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
// 	"cornucopia/listah/internal/pkg/utils"
// )

// func (s *Server) UpdateOne(ctx context.Context, req *connect.Request[v1.ItemServiceUpdateOneRequest]) (*connect.Response[v1.ItemServiceUpdateOneResponse], error) {
// 	ctx, span := otel.Tracer("item-service").Start(ctx, "update-one")
// 	defer span.End()
// 	s.Infra.Logger.For(ctx).Info("UpdateOne method in ItemService called")

// 	// panic("Implement me!")

// 	// Read initial model from repository
// 	readModel := model.ItemRead{Id: req.Msg.Id}
// 	if err := s.Infra.Repository.Item.SelectOne(ctx, &readModel, "id"); err != nil {
// 		return nil, err
// 	}

// 	// Create model for update from request
// 	updateModel := new(model.ItemWrite)
// 	updateModel.UpdateOneItemModelFromRequest(req.Msg, &readModel)

// 	// Update model in repository
// 	if err := s.Infra.Repository.Item.UpdateOne(ctx, updateModel); err != nil {
// 		return nil, err
// 	}

// 	// Read model from repository after update
// 	afterUpdateRead := model.ItemRead{Id: req.Msg.Id}
// 	if err := s.Infra.Repository.Item.SelectOne(ctx, &afterUpdateRead, "id"); err != nil {
// 		return nil, err
// 	}

// 	// Convert model to generic (create response) proto message
// 	genericResponse := afterUpdateRead.ItemModelToResponse()

// 	// Marshal copy from generic (create response) to update response proto message
// 	responseModel := new(v1.ItemServiceUpdateOneResponse)
// 	utils.MarshalCopyProto(genericResponse, responseModel)

// 	return connect.NewResponse(responseModel), nil
// }

// func (s *Server) UpdateMany(ctx context.Context, req *connect.Request[v1.ItemServiceUpdateManyRequest]) (*connect.Response[v1.ItemServiceUpdateManyResponse], error) {
// 	ctx, span := otel.Tracer("item-service").Start(ctx, "update-many")
// 	defer span.End()
// 	s.Infra.Logger.For(ctx).Info("UpdateMany method in ItemService called")

// 	// Read initial model from repository
// 	readModels := model.ItemsRead{}
// 	for _, val := range req.Msg.Item {
// 		readModels = append(readModels, &model.ItemRead{Id: val.Id})
// 	}
// 	if err := s.Infra.Repository.Item.SelectMany(ctx, &readModels, "id"); err != nil {
// 		return nil, err
// 	}

// 	// Create model for update from request
// 	updateModels := model.UpdateManyItemModelFromRequest(req.Msg, &readModels)

// 	// Update model in repository
// 	if err := s.Infra.Repository.Item.UpdateMany(ctx, updateModels); err != nil {
// 		return nil, err
// 	}

// 	// Read model from repository after update
// 	afterUpdateRead := model.ItemsRead{}
// 	for _, val := range req.Msg.Item {
// 		afterUpdateRead = append(afterUpdateRead, &model.ItemRead{Id: val.Id})
// 	}
// 	if err := s.Infra.Repository.Item.SelectMany(ctx, &afterUpdateRead, "id"); err != nil {
// 		return nil, err
// 	}

// 	// Convert model to generic (create response) proto message
// 	genericResponse := afterUpdateRead.ManyItemModelToResponse()

// 	// Marshal copy from generic (create response) to update response proto message
// 	responseModel := new(v1.ItemServiceUpdateManyResponse)
// 	utils.MarshalCopyProto(genericResponse, responseModel)

// 	return connect.NewResponse(responseModel), nil
// }
