package gateway

import (
	"context"
	"log"
	"net/http"

	gwruntime "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/grpclog"

	pb "cornucopia/listah/internal/pkg/proto/listah/v1"
)

// Endpoint describes a gRPC endpoint
type Endpoint struct {
	Network, Addr string
}

// Options is a set of options to be passed to Run
type Options struct {
	// Addr is the address to listen
	Addr string

	// GRPCServer defines an endpoint of a gRPC service
	GRPCServer Endpoint

	// OpenAPIDir is a path to a directory from which the server
	// serves OpenAPI specs.
	OpenAPIDir string

	// Mux is a list of options to be passed to the gRPC-Gateway multiplexer
	Mux []gwruntime.ServeMuxOption
}

// Run starts a HTTP server and blocks while running if successful.
// The server will be shutdown when "ctx" is canceled.
func Run(ctx context.Context, opts Options) error {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// Dial gRPC server
	conn, err := dial(opts.GRPCServer.Network, opts.GRPCServer.Addr)
	if err != nil {
		return err
	}
	go func() {
		<-ctx.Done()
		if err := conn.Close(); err != nil {
			grpclog.Errorf("Failed to close a client connection to the gRPC server: %v", err)
		}
	}()

	mux := http.NewServeMux()
	mux.HandleFunc("/openapiv2/", openAPIServer(opts.OpenAPIDir))
	mux.HandleFunc("/healthz", healthzServer(conn))

	// gw, err := newGateway(ctx, conn, opts.Mux)
	gw, err := newGatewayEndpoint(ctx, opts.GRPCServer.Addr, opts.Mux)
	if err != nil {
		return err
	}
	mux.Handle("/", gw)

	s := &http.Server{
		Addr:    opts.Addr,
		Handler: logRequestBody(allowCORS(mux)),
	}
	go func() {
		<-ctx.Done()
		grpclog.Infof("Shutting down the http server")
		if err := s.Shutdown(context.Background()); err != nil {
			grpclog.Errorf("Failed to shutdown http server: %v", err)
		}
	}()

	grpclog.Infof("Starting listening at %s", opts.Addr)
	if err := s.ListenAndServe(); err != http.ErrServerClosed {
		grpclog.Errorf("Failed to listen and serve: %v", err)
		return err
	}

	return nil
}

func RunSimple(ctx context.Context, opts Options) error {
	log.Printf("Beginning running server")
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// Register gRPC server endpoint
	// Note: Make sure the gRPC server is running properly and accessible
	mux := gwruntime.NewServeMux()
	optz := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}
	err := pb.RegisterUserServiceHandlerFromEndpoint(ctx, mux, opts.GRPCServer.Addr, optz)
	if err != nil {
		return err
	}

	log.Printf("Listening on server")
	// Start HTTP server (and proxy calls to gRPC server endpoint)
	return http.ListenAndServe(opts.Addr, mux)
}
