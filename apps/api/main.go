package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/pkg/errors"
	"google.golang.org/grpc/grpclog"

	"cornucopia/listah/internal/app/server"
)

var (
	addrGrpc    = flag.String("addr_grpc", ":9090", "endpoint of the gRPC service")
	networkGrpc = flag.String("network_grpc", "tcp", "a valid network type which is consistent to -addr")
)

func main() {
	log.Printf("Starting to run connect-go server")
	if err := server.Run(); err != nil {
		fmt.Println(errors.Cause(err))
		log.Fatal(err)
		grpclog.Fatal(err)
	}
}
