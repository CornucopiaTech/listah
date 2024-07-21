package user

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	pb "cornucopia/listah/internal/pkg/proto/listah/v1"
	"log"

	"connectrpc.com/connect"
	"github.com/google/uuid"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

func (s *Server) Read(ctx context.Context, req *connect.Request[pb.UserServiceReadRequest]) (*connect.Response[pb.UserServiceReadResponse], error) {
	// Create a span to track `childFunction()` - this is a nested span whose parent is `parentSpan`
	ctx, span := otel.Tracer("users").Start(ctx, "read")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Reading user with zap logger factory", zap.String("user", req.Msg.Id))

	readUser := s.Infra.Repository.Users.SelectOne(ctx, req.Msg.Id)

	res := connect.NewResponse(&pb.UserServiceReadResponse{
		// req.Msg is a strongly-typed *pingv1.PingRequest, so we can access its
		// fields without type assertions.
		Id:          readUser.Id,
		FirstName:   readUser.FirstName,
		MiddleNames: readUser.MiddleNames,
		LastName:    readUser.LastName,
		Username:    readUser.Username,
		Email:       readUser.Email,
		Role:        readUser.Role,
		// Audit: &v1.Audit{
		// 	CreatedBy: readUser.Audit.CreatedBy,
		// 	CreatedAt: readUser.Audit.CreatedAt,
		// 	UpdatedBy: readUser.Audit.CreatedBy,
		// 	UpdatedAt: readUser.Audit.UpdatedAt,
		// },
	})

	res.Header().Set("Some-Other-Header", "hello!")
	return res, nil
}

func (s *Server) Create(ctx context.Context, req *connect.Request[pb.UserServiceCreateRequest]) (*connect.Response[pb.UserServiceCreateResponse], error) {
	ctx, span := otel.Tracer("users").Start(ctx, "create")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Creating user", zap.String("user", req.Msg.Id))

	newUser := &model.User{
		Id:          uuid.New().String(),
		FirstName:   req.Msg.FirstName,
		MiddleNames: req.Msg.MiddleNames,
		LastName:    req.Msg.LastName,
		Username:    req.Msg.Username,
		Email:       req.Msg.Email,
		Role:        req.Msg.Role,
		// Audit: model.Audit{
		// 	CreatedBy: req.Msg.Audit.CreatedBy,
		// 	CreatedAt: time.Now().UTC().Format("2006-01-02 15:04:05.000000"), // time.Now().UTC().UnixMilli(),
		// 	UpdatedBy: req.Msg.Audit.CreatedBy,
		// 	UpdatedAt: time.Now().UTC().Format("2006-01-02 15:04:05.000000"),
		// },
	}

	if err := s.Infra.Repository.Users.InsertOne(ctx, newUser); err != nil {
		s.Infra.Logger.For(ctx).Fatal("Error occurred while creating user", zap.String("user", req.Msg.Id))
	}
	createdUser := s.Infra.Repository.Users.SelectOne(ctx, newUser.Id)

	res := connect.NewResponse(&pb.UserServiceCreateResponse{
		// req.Msg is a strongly-typed *pingv1.PingRequest, so we can access its
		// fields without type assertions.
		Id:          createdUser.Id,
		FirstName:   createdUser.FirstName,
		MiddleNames: createdUser.MiddleNames,
		LastName:    createdUser.LastName,
		Username:    createdUser.Username,
		Email:       createdUser.Email,
		Role:        createdUser.Role,
		// Audit: &v1.Audit{
		// 	CreatedBy: createdUser.Audit.CreatedBy,
		// 	CreatedAt: createdUser.Audit.CreatedAt,
		// 	UpdatedBy: createdUser.Audit.CreatedBy,
		// 	UpdatedAt: createdUser.Audit.UpdatedAt,
		// },
	})

	res.Header().Set("Some-Other-Header", "hello!")
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
