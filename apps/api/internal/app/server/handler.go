package server

import (
	"net/http"
	"path"
	"github.com/go-chi/cors"
	chi "github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"fmt"
	"golang.org/x/net/http2/h2c"
	"golang.org/x/net/http2"


	"cornucopia/listah/apps/api/internal/app/bootstrap"
	itemV1 "cornucopia/listah/apps/api/internal/app/item/v1"
	categoryV1 "cornucopia/listah/apps/api/internal/app/category/v1"
	tagV1 "cornucopia/listah/apps/api/internal/app/tag/v1"
	"cornucopia/listah/apps/api/internal/pkg/middleware"
	"cornucopia/listah/apps/api/internal/pkg/proto/v1/v1connect"

)


func handle(i *bootstrap.Infra) http.Handler {
	allowedOrigins := []string{
		i.Config.Web.Address,
		i.Config.Web.UrlAddress,
		i.Config.Web.Url,
		i.Config.Web.Host,
		"127.0.0.1",
	}
	mux := chi.NewRouter()
	mux.Use(cors.Handler(cors.Options{
    AllowedOrigins:   allowedOrigins,
    AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "traceparent"},
    // ExposedHeaders:   []string{"Link"},
    // AllowCredentials: false,
    // MaxAge:           300, // Maximum value not ignored by any of major browsers
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
	mux.Mount(ip, otelhttp.WithRouteTag(ip, ih))



	// Handle Category connect-go generated paths
	cp, ch := v1connect.NewCategoryServiceHandler(categoryV1.NewServer(i), icp)
	mux.Mount(cp, otelhttp.WithRouteTag(cp, ch))

	// Handle Tag connect-go generated paths
	tp, th := v1connect.NewTagServiceHandler(tagV1.NewServer(i), icp)
	mux.Mount(tp, otelhttp.WithRouteTag(tp, th))



	handleDoc := func(w http.ResponseWriter, r *http.Request) {
		p := path.Join(i.Config.ProjectRoot, "public", "index.html")
		http.ServeFile(w, r, p)
	}
	mux.Mount("/", otelhttp.WithRouteTag("/", http.HandlerFunc(handleDoc)))


	return h2c.NewHandler(mux, &http2.Server{})
}
