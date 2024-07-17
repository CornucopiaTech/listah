package user

import (
	"context"
	pb "cornucopia/listah/internal/pkg/proto/listah/v1"
	"log"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

type User struct {
}

func (s *Server) Read(ctx context.Context, req *connect.Request[pb.UserServiceReadRequest]) (*connect.Response[pb.UserServiceReadResponse], error) {
	// Create a span to track `childFunction()` - this is a nested span whose parent is `parentSpan`
	ctx, span := otel.Tracer("users").Start(ctx, "read")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Reading user", zap.String("user", req.Msg.Id))

	// ToDo: Implement Read Function
	res := connect.NewResponse(&pb.UserServiceReadResponse{
		Id:          "User Read Id1",
		FirstName:   "User Read First Name",
		MiddleNames: "User Read Middle Name",
		LastNames:   "User Read Last Name",
		Username:    "User Read User Name",
		Email:       "User Read Email",
		Role:        "User Read Role",
	})
	res.Header().Set("Some-Other-Header", "hello!")
	return res, nil
}

func (s *Server) Create(ctx context.Context, req *connect.Request[pb.UserServiceCreateRequest]) (*connect.Response[pb.UserServiceCreateResponse], error) {
	ctx, span := otel.Tracer("users").Start(ctx, "create")
	defer span.End()

	s.Infra.Logger.For(ctx).Info("Creating user", zap.String("user", req.Msg.Id))

	// ToDo: Implement Read Function
	res := connect.NewResponse(&pb.UserServiceCreateResponse{
		// req.Msg is a strongly-typed *pingv1.PingRequest, so we can access its
		// fields without type assertions.
		Id:          req.Msg.Id,
		FirstName:   req.Msg.FirstName,
		MiddleNames: req.Msg.MiddleNames,
		LastNames:   req.Msg.LastNames,
		Username:    req.Msg.Username,
		Email:       req.Msg.Email,
		Role:        req.Msg.Role,
		Audit:       req.Msg.Audit,
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
		LastNames:   req.Msg.LastNames,
		Username:    req.Msg.Username,
		Email:       req.Msg.Email,
		Role:        req.Msg.Role,
		Audit:       req.Msg.Audit,
	})
	res.Header().Set("Some-Other-Header", "hello!")
	return res, nil
}
