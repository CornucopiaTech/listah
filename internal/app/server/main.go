package server

import (
	"context"
	"log"
	"net/http"

	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"cornucopia/listah/internal/app/user"
	pb "cornucopia/listah/internal/pkg/proto/listah/v1"
)

// Run starts the gRPC service.
// "network" and "address" are passed to net.Listen.
func Run(ctx context.Context, network, address string) error {
	mux := http.NewServeMux()
	// The generated constructors return a path and a plain net/http
	// handler.
	path, handler := pb.NewUserServiceHandler.NewGreetServiceHandler(user.NewUserServer())
	mux.Handle(path, handler)
	err := http.ListenAndServe(
		"localhost:8080",
		// For gRPC clients, it's convenient to support HTTP/2 without TLS. You can
		// avoid x/net/http2 by using http.ListenAndServeTLS.
		h2c.NewHandler(mux, &http2.Server{}),
	)
	log.Fatalf("listen failed: %v", err)
	return err
}
