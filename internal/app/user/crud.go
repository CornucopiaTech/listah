package user

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

func (s *Server) Create(ctx context.Context, req *connect.Request[pb.UserServiceCreateRequest]) (*connect.Response[pb.UserServiceCreateResponse], error) {
	ctx, span := otel.Tracer("user-service").Start(ctx, "create")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Creating user")

	// Get user model for user repository
	newUserModel := new(model.User)
	newUserModel.CreateUserModelFromRequest(ctx, req.Msg)

	// Inser user model in repository
	if err := s.Infra.Repository.Users.InsertOne(ctx, newUserModel); err != nil {
		return nil, err
	}

	// Read created user model from repository
	readUser, err := s.Infra.Repository.Users.SelectOne(ctx, newUserModel.Id)
	if err != nil {
		return nil, err
	}

	// Convert created user model to proto response
	resUser := readUser.UserModelToResponse(ctx)
	res := connect.NewResponse(resUser)

	return res, nil
}

func (s *Server) Read(ctx context.Context, req *connect.Request[pb.UserServiceReadRequest]) (*connect.Response[pb.UserServiceReadResponse], error) {
	ctx, span := otel.Tracer("user-service").Start(ctx, "read")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Reading user", zap.String("user", req.Msg.Id))

	// Read user model from repository
	readUser, err := s.Infra.Repository.Users.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Convert user model to generic (user create) proto response
	genericResUser := readUser.UserModelToResponse(ctx)

	// Marshal copy from generic user response to read user response
	resUser := new(pb.UserServiceReadResponse)
	utils.MarshalCopyProto(genericResUser, resUser)

	res := connect.NewResponse(resUser)

	return res, nil
}

func (s *Server) Update(ctx context.Context, req *connect.Request[pb.UserServiceUpdateRequest]) (*connect.Response[pb.UserServiceUpdateResponse], error) {
	ctx, span := otel.Tracer("user-service").Start(ctx, "update")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Updating user", zap.String("user", req.Msg.Id))

	// Read initial user model from repository
	readUser, err := s.Infra.Repository.Users.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Create user model for update from information sent in request
	updateUserModel := new(model.User)
	updateUserModel.UpdateUserModelFromRequest(ctx, req.Msg, readUser)

	// Update User model in repository
	if err := s.Infra.Repository.Users.UpdateOne(ctx, updateUserModel); err != nil {
		return nil, err
	}

	// Read user model from repository after update
	readUser, err = s.Infra.Repository.Users.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Convert user model to generic (user create response) proto message
	genericResUser := readUser.UserModelToResponse(ctx)

	// Marshal copy from generic (user create response) to update response proto message
	resUser := new(pb.UserServiceUpdateResponse)

	utils.MarshalCopyProto(genericResUser, resUser)

	res := connect.NewResponse(resUser)
	return res, nil
}

func (s *Server) Delete(ctx context.Context, req *connect.Request[pb.UserServiceDeleteRequest]) (*connect.Response[pb.UserServiceDeleteResponse], error) {
	ctx, span := otel.Tracer("user-service").Start(ctx, "delete")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Deleting user", zap.String("user", req.Msg.Id))

	// Read initial user model from repository
	readUser, err := s.Infra.Repository.Users.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Create user model for update from information sent in request
	updateUserModel := new(model.User)
	updateUserModel.DeleteUserModelFromRequest(ctx, req.Msg, readUser)

	// Update User model in repository
	if err := s.Infra.Repository.Users.SoftDeleteOne(ctx, updateUserModel); err != nil {
		return nil, err
	}

	// Read user model from repository after soft-delete
	readUser, err = s.Infra.Repository.Users.SelectOne(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	// Convert user model to generic (user create response) proto message
	genericResUser := readUser.UserModelToResponse(ctx)

	// Marshal copy from generic (user create response) to update response proto message
	resUser := new(pb.UserServiceDeleteResponse)

	utils.MarshalCopyProto(genericResUser, resUser)

	res := connect.NewResponse(resUser)
	return res, nil
}

func (s *Server) Echo(ctx context.Context, req *connect.Request[pb.UserServiceCreateRequest]) (*connect.Response[pb.UserServiceCreateRequest], error) {
	// connect.Request and connect.Response give you direct access to headers and
	// trailers. No context-based nonsense!
	log.Println(req.Header().Get("Some-Header"))
	res := connect.NewResponse(&pb.UserServiceCreateRequest{
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
