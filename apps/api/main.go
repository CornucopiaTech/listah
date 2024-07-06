package main

import (
	"context"
	"flag"
	"log"

	"google.golang.org/grpc/grpclog"

	server "cornucopia/listah/internal/app/server"
)

var (
	addrGateway = flag.String("addr_gateway", ":8080", "endpoint of the gateway server")
	addrGrpc    = flag.String("addr_grpc", ":9090", "endpoint of the gRPC service")
	networkGrpc = flag.String("network_grpc", "tcp", "a valid network type which is consistent to -addr")

	openAPIDir = flag.String("openapi_dir", "internal/app/openapiv2/listah/v1", "path to the directory which contains OpenAPI definitions")
)

func main() {
	ctx := context.Background()
	log.Printf("Starting to run gRPC server")
	if err := server.Run(ctx, *networkGrpc, *addrGrpc); err != nil {
		log.Fatal(err)
		grpclog.Fatal(err)
	}
}
