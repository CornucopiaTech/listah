package main

import (
	"context"
	"flag"
	"log"

	"google.golang.org/grpc/grpclog"

	server "cornucopia/listah/internal/app/server"
)

var (
	addrGrpc    = flag.String("addr_grpc", ":9090", "endpoint of the gRPC service")
	networkGrpc = flag.String("network_grpc", "tcp", "a valid network type which is consistent to -addr")
)

func main() {
	ctx := context.Background()
	log.Printf("Starting to run connect-go server")
	if err := server.Run(ctx, *networkGrpc, *addrGrpc); err != nil {
		log.Fatal(err)
		grpclog.Fatal(err)
	}
}
