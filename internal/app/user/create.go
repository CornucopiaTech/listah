package user

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"log"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
)

func (s *Server) CreateOne(ctx context.Context, req *connect.Request[v1.UserServiceCreateOneRequest]) (*connect.Response[v1.UserServiceCreateOneResponse], error) {
	ctx, span := otel.Tracer("user-service").Start(ctx, "create-one")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("ReadOne method in UserService called")

	// Create model for repository
	newModel := new(model.User)
	newModel.CreateOneUserModelFromRequest(req.Msg)

	// Insert model in repository
	if err := s.Infra.Repository.User.InsertOne(ctx, newModel); err != nil {
		return nil, err
	}

	// Read created model from repository
	readModel := model.User{Id: newModel.Id}
	if err := s.Infra.Repository.User.SelectOne(ctx, &readModel, "id"); err != nil {
		return nil, err
	}

	// Convert created model to proto response
	responseModel := readModel.UserModelToResponse()

	return connect.NewResponse(responseModel), nil
}

func (s *Server) CreateMany(ctx context.Context, req *connect.Request[v1.UserServiceCreateManyRequest]) (*connect.Response[v1.UserServiceCreateManyResponse], error) {
	ctx, span := otel.Tracer("user-service").Start(ctx, "create-many")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("CreateMany method in UserService called")

	// Create model for repository
	newModel := model.CreateManyUserModelFromRequest(req.Msg)

	// Insert model in repository
	if err := s.Infra.Repository.User.InsertMany(ctx, newModel); err != nil {
		return nil, err
	}

	// Read created model from repository
	readModel := model.Users{}
	for _, val := range *newModel {
		readModel = append(readModel, &model.User{Id: val.Id})
	}
	if err := s.Infra.Repository.User.SelectMany(ctx, &readModel, "id"); err != nil {
		return nil, err
	}

	// Convert created model to proto response
	resModel := readModel.ManyUserModelToResponse()

	return connect.NewResponse(resModel), nil
}

func (s *Server) Echo(ctx context.Context, req *connect.Request[v1.UserServiceEchoRequest]) (*connect.Response[v1.UserServiceEchoResponse], error) {
	// connect.Request and connect.Response give you direct access to headers and
	// trailers. No context-based nonsense!
	log.Println(req.Header().Get("Some-Header"))
	res := connect.NewResponse(&v1.UserServiceEchoResponse{
		// req.Msg is a strongly-typed *pingv1.PingRequest, so we can access its
		// fields without type assertions.
		Id:          req.Msg.Id,
		FirstName:   req.Msg.FirstName,
		MiddleNames: req.Msg.MiddleNames,
		LastName:    req.Msg.LastName,
		Username:    req.Msg.Username,
		Email:       req.Msg.Email,
		Role:        req.Msg.Role,
		Audit:       req.Msg.Audit,
	})
	res.Header().Set("Some-Other-Header", "hello!")
	return res, nil
}
