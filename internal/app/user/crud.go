package user

import (
	"context"

	"google.golang.org/grpc/grpclog"
	// "google.golang.org/grpc/metadata"

	pb "cornucopia/listah/internal/pkg/proto/listah/v1"
)

type User struct {
}

func (s *service) Read(ctx context.Context, req *pb.UserServiceReadRequest) (*pb.UserServiceReadResponse, error) {
	// ToDO: Implement Read Function
	grpclog.Info(req)
	// grpc.SendHeader(ctx, metadata.New(map[string]string{
	// 	"foo": "foo1",
	// 	"bar": "bar1",
	// }))
	// grpc.SetTrailer(ctx, metadata.New(map[string]string{
	// 	"foo": "foo2",
	// 	"bar": "bar2",
	// }))
	return new(pb.UserServiceReadResponse), nil
}
