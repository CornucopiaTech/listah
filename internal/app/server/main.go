package server

import (
	"context"
	"net"

	"cornucopia/listah/internal/app/user"
	pb "cornucopia/listah/internal/pkg/proto/listah/v1"

	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"
)

// Run starts the gRPC service.
// "network" and "address" are passed to net.Listen.
func Run(ctx context.Context, network, address string) error {
	l, err := net.Listen(network, address)
	if err != nil {
		return err
	}
	defer func() {
		if err := l.Close(); err != nil {
			grpclog.Errorf("Failed to close %s %s: %v", network, address, err)
		}
	}()

	s := grpc.NewServer()
	pb.RegisterUserServiceServer(s, user.NewUserServer())

	go func() {
		defer s.GracefulStop()
		<-ctx.Done()
	}()
	return s.Serve(l)
}
