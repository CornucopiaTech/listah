package gateway

import (
	"context"
	"fmt"
	"net"
	"net/http"

	"google.golang.org/grpc/credentials/insecure"

	pb "cornucopia/listah/internal/pkg/proto/listah/v1"

	gwruntime "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	_ "google.golang.org/genproto/googleapis/rpc/errdetails"
	"google.golang.org/grpc"
)

// newGateway returns a new gateway server which translates HTTP into gRPC.
func newGateway(ctx context.Context, conn *grpc.ClientConn, opts []gwruntime.ServeMuxOption) (http.Handler, error) {

	mux := gwruntime.NewServeMux(opts...)

	for _, f := range []func(context.Context, *gwruntime.ServeMux, *grpc.ClientConn) error{
		pb.RegisterUserServiceHandler,
	} {
		if err := f(ctx, mux, conn); err != nil {
			return nil, err
		}
	}
	return mux, nil
}

// newGateway returns a new gateway server which translates HTTP into gRPC.
func newGatewayEndpoint(ctx context.Context, grpcServerAddress string, opts []gwruntime.ServeMuxOption) (http.Handler, error) {

	mux := gwruntime.NewServeMux(opts...)
	optz := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}

	for _, f := range []func(context.Context, *gwruntime.ServeMux, string, []grpc.DialOption) error{
		pb.RegisterUserServiceHandlerFromEndpoint,
	} {
		if err := f(ctx, mux, grpcServerAddress, optz); err != nil {
			return nil, err
		}
	}
	return mux, nil
}

func dial(network, addr string) (*grpc.ClientConn, error) {
	switch network {
	case "tcp":
		return dialTCP(addr)
	case "unix":
		return dialUnix(addr)
	default:
		return nil, fmt.Errorf("unsupported network type %q", network)
	}
}

// dialTCP creates a client connection via TCP.
// "addr" must be a valid TCP address with a port number.
func dialTCP(addr string) (*grpc.ClientConn, error) {
	return grpc.NewClient(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
}

// dialUnix creates a client connection via a unix domain socket.
// "addr" must be a valid path to the socket.
func dialUnix(addr string) (*grpc.ClientConn, error) {
	d := func(ctx context.Context, addr string) (net.Conn, error) {
		return (&net.Dialer{}).DialContext(ctx, "unix", addr)
	}
	return grpc.NewClient(addr, grpc.WithTransportCredentials(insecure.NewCredentials()), grpc.WithContextDialer(d))
}
