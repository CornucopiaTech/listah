package main

import (
	"context"
	"flag"
	"log"

	"google.golang.org/grpc/grpclog"

	gateway "cornucopia/listah/internal/app/gateway"
	server "cornucopia/listah/internal/app/server"
)

var (
	addrGateway = flag.String("addr_gateway", ":8080", "endpoint of the gateway server")
	addrGrpc    = flag.String("addr_grpc", ":9090", "endpoint of the gRPC service")
	networkGrpc = flag.String("network_grpc", "tcp", "a valid network type which is consistent to -addr")

	openAPIDir = flag.String("openapi_dir", "internal/app/openapiv2/listah/v1", "path to the directory which contains OpenAPI definitions")
)

func main() {
	flag.Parse()

	ctx := context.Background()

	go func() {
		log.Printf("Starting to run gateway server")
		opts := gateway.Options{
			Addr: *addrGateway,
			GRPCServer: gateway.Endpoint{
				Network: *networkGrpc,
				Addr:    *addrGrpc,
			},
			OpenAPIDir: *openAPIDir,
		}
		if err := gateway.Run(ctx, opts); err != nil {
			log.Fatal(err)
			grpclog.Fatal(err)
		}
	}()

	log.Printf("Starting to run gRPC server")
	if err := server.Run(ctx, *networkGrpc, *addrGrpc); err != nil {
		log.Fatal(err)
		grpclog.Fatal(err)
	}
}
