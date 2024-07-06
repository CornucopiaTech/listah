package user

import (
	"context"

	"google.golang.org/grpc/grpclog"
	// "google.golang.org/grpc/metadata"
	"log"

	"connectrpc.com/connect"

	pb "cornucopia/listah/internal/pkg/proto/listah/v1"
)

type User struct {
}

func (s *service) Read(ctx context.Context, req *pb.UserServiceReadRequest) (*pb.UserServiceReadResponse, error) {
	// ToDo: Implement Read Function
	grpclog.Info(req)
	return new(pb.UserServiceReadResponse), nil
}

func (s *service) Create(ctx context.Context, req *connect.Request[pb.UserServiceCreateRequest]) (*connect.Response[pb.UserServiceCreateResponse], error) {
	// connect.Request and connect.Response give you direct access to headers and
	// trailers. No context-based nonsense!
	log.Println(req.Header().Get("Some-Header"))
	res := connect.NewResponse(new(pb.UserServiceReadResponse))
	res.Header().Set("Some-Other-Header", "hello!")
	return res, nil
}

func (s *service) Echo(ctx context.Context, req *connect.Request[pb.UserServiceCreateRequest]) (*connect.Response[pb.UserServiceCreateResponse], error) {
	// connect.Request and connect.Response give you direct access to headers and
	// trailers. No context-based nonsense!
	log.Println(req.Header().Get("Some-Header"))
	res := connect.NewResponse(&pb.UserServiceCreateResponse{
		// req.Msg is a strongly-typed *pingv1.PingRequest, so we can access its
		// fields without type assertions.
		id:           req.Msg.id,
		first_name:   req.Msg.first_name,
		middle_names: req.Msg.middle_names,
		last_names:   req.Msg.last_names,
		username:     req.Msg.username,
		email:        req.Msg.email,
		role:         req.Msg.role,
		audit:        req.Msg.audit,
	})
	res.Header().Set("Some-Other-Header", "hello!")
	return res, nil
}
