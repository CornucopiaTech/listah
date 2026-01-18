package main

import (
	"fmt"
	"log"
	"os"
	"github.com/pkg/errors"
	"google.golang.org/grpc/grpclog"


	"cornucopia/listah/apps/api/internal/app/server"
)

func main() {
	log.Printf("Starting to run connect-go server")
	if err := server.Run(); err != nil {
		fmt.Println(errors.Cause(err))
		log.Fatal(err)
		grpclog.Fatal(err)
	}
	defer os.Exit(0)
}
