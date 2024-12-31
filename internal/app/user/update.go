package user

// import (
// 	"context"
// 	"cornucopia/listah/internal/pkg/model"
// 	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
// 	"cornucopia/listah/internal/pkg/utils"

// 	"connectrpc.com/connect"
// 	"go.opentelemetry.io/otel"
// )

// func (s *Server) UpdateOne(ctx context.Context, req *connect.Request[v1.UserServiceUpdateOneRequest]) (*connect.Response[v1.UserServiceUpdateOneResponse], error) {
// 	ctx, span := otel.Tracer("user-service").Start(ctx, "update-one")
// 	defer span.End()
// 	s.Infra.Logger.For(ctx).Info("UpdateOne method in UserService called")

// 	// Read initial model from repository
// 	readModel := model.User{Id: req.Msg.Id}
// 	if err := s.Infra.Repository.User.SelectOne(ctx, &readModel, "id"); err != nil {
// 		return nil, err
// 	}

// 	// Create model for update from request
// 	updateModel := new(model.User)
// 	updateModel.UpdateOneUserModelFromRequest(req.Msg, &readModel)

// 	// Update model in repository
// 	if err := s.Infra.Repository.User.UpdateOne(ctx, updateModel); err != nil {
// 		return nil, err
// 	}

// 	// Read model from repository after update
// 	afterUpdateRead := model.User{Id: req.Msg.Id}
// 	if err := s.Infra.Repository.User.SelectOne(ctx, &afterUpdateRead, "id"); err != nil {
// 		return nil, err
// 	}

// 	// Convert model to generic (create response) proto message
// 	genericResponse := afterUpdateRead.UserModelToResponse()

// 	// Marshal copy from generic (create response) to update response proto message
// 	responseModel := new(v1.UserServiceUpdateOneResponse)
// 	utils.MarshalCopyProto(genericResponse, responseModel)

// 	return connect.NewResponse(responseModel), nil
// }

// func (s *Server) UpdateMany(ctx context.Context, req *connect.Request[v1.UserServiceUpdateManyRequest]) (*connect.Response[v1.UserServiceUpdateManyResponse], error) {
// 	ctx, span := otel.Tracer("user-service").Start(ctx, "update-many")
// 	defer span.End()
// 	s.Infra.Logger.For(ctx).Info("UpdateMany method in UserService called")

// 	// Read initial model from repository
// 	readModels := model.Users{}
// 	for _, val := range req.Msg.User {
// 		readModels = append(readModels, &model.User{Id: val.Id})
// 	}
// 	if err := s.Infra.Repository.User.SelectMany(ctx, &readModels, "id"); err != nil {
// 		return nil, err
// 	}

// 	// Create model for update from request
// 	updateModels := model.UpdateManyUserModelFromRequest(req.Msg, &readModels)

// 	// Update model in repository
// 	if err := s.Infra.Repository.User.UpdateMany(ctx, updateModels); err != nil {
// 		return nil, err
// 	}

// 	// Read model from repository after update
// 	afterUpdateRead := model.Users{}
// 	for _, val := range req.Msg.User {
// 		afterUpdateRead = append(afterUpdateRead, &model.User{Id: val.Id})
// 	}
// 	if err := s.Infra.Repository.User.SelectMany(ctx, &afterUpdateRead, "id"); err != nil {
// 		return nil, err
// 	}

// 	// Convert model to generic (create response) proto message
// 	genericResponse := afterUpdateRead.ManyUserModelToResponse()

// 	// Marshal copy from generic (create response) to update response proto message
// 	responseModel := new(v1.UserServiceUpdateManyResponse)
// 	utils.MarshalCopyProto(genericResponse, responseModel)

// 	return connect.NewResponse(responseModel), nil
// }
