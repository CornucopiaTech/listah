package server

import (
	"fmt"
	"net/http"
	"path"
	"strings"

	chi "github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	// clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/go-chi/cors"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"cornucopia/listah/internal/app/bootstrap"
	itemV1 "cornucopia/listah/internal/app/item/v1"
	"cornucopia/listah/internal/pkg/middleware"
	"cornucopia/listah/internal/pkg/proto/v1/v1connect"
)

func handle(i *bootstrap.Infra) http.Handler {
	allowedOrigins := strings.Split(strings.TrimSpace(i.Config.Api.AllowedOrigins), ",")
	mux := chi.NewRouter()
	mux.Use(cors.Handler(cors.Options{
		AllowedOrigins: allowedOrigins,
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "traceparent", "Connect-Protocol-Version", "X-Request-Id"},
		ExposedHeaders: []string{"X-Request-Id"},
	}))

	mux.Use(chimiddleware.RequestID)
	mux.Use(chimiddleware.RealIP)
	mux.Use(chimiddleware.Logger)
	mux.Use(chimiddleware.Recoverer)
	mux.Use(chimiddleware.Timeout(60 * 60 * 1e9)) // 1 hour

	fmt.Printf("Allowed Origins are: %v\n", allowedOrigins)

	// Get gRPC interceptors chain
	icp := middleware.GetInterceptors(i)

	//
	// Handle Item connect-go generated paths
	ip, ih := v1connect.NewItemServiceHandler(itemV1.NewServer(i), icp)
	mux.Mount(ip, ih)
	// mux.Mount(ip, clerkhttp.WithHeaderAuthorization()(ih))

	handleDoc := func(w http.ResponseWriter, r *http.Request) {
		p := path.Join(i.Config.ProjectRoot, "public", "index.html")
		fmt.Printf("Path to index file: %v\n", p)
		http.ServeFile(w, r, p)
	}
	mux.Mount("/", http.HandlerFunc(handleDoc))

	handleHealth := func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Ready")
	}
	mux.Mount("/health", http.HandlerFunc(handleHealth))

	return h2c.NewHandler(mux, &http2.Server{})
}
