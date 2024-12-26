package user

// import (
// 	"context"
// 	"cornucopia/listah/internal/pkg/model"
// 	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
// 	"cornucopia/listah/internal/pkg/utils"

// 	"connectrpc.com/connect"
// 	"go.opentelemetry.io/otel"
// )

// func (s *Server) ReadOne(ctx context.Context, req *connect.Request[v1.UserServiceReadOneRequest]) (*connect.Response[v1.UserServiceReadOneResponse], error) {
// 	ctx, span := otel.Tracer("user-service").Start(ctx, "read-one")
// 	defer span.End()
// 	s.Infra.Logger.For(ctx).Info("ReadOne method in UserService called")

// 	// Read model from repository
// 	readModel := model.User{Id: req.Msg.Id}
// 	if err := s.Infra.Repository.User.SelectOne(ctx, &readModel, "id"); err != nil {
// 		return nil, err
// 	}

// 	// Convert model to generic (create) proto response
// 	genericResponse := readModel.UserModelToResponse()

// 	// Marshal copy from generic response to read response
// 	responseModel := new(v1.UserServiceReadOneResponse)
// 	utils.MarshalCopyProto(genericResponse, responseModel)

// 	return connect.NewResponse(responseModel), nil
// }

// func (s *Server) ReadMany(ctx context.Context, req *connect.Request[v1.UserServiceReadManyRequest]) (*connect.Response[v1.UserServiceReadManyResponse], error) {
// 	ctx, span := otel.Tracer("user-service").Start(ctx, "read-many")
// 	defer span.End()
// 	s.Infra.Logger.For(ctx).Info("ReadMany method in UserService called")

// 	// Read model from repository
// 	readModels := model.Users{}
// 	for _, val := range req.Msg.User {
// 		readModels = append(readModels, &model.User{Id: val.Id})
// 	}
// 	if err := s.Infra.Repository.User.SelectMany(ctx, &readModels, "id"); err != nil {
// 		return nil, err
// 	}

// 	// Convert model to generic (create) proto response
// 	genericResponse := readModels.ManyUserModelToResponse()

// 	// Marshal copy from generic response to read response
// 	responseModel := new(v1.UserServiceReadManyResponse)
// 	utils.MarshalCopyProto(genericResponse, responseModel)

// 	return connect.NewResponse(responseModel), nil
// }
