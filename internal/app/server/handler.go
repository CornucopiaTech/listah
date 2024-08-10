package server

import (
	"net/http"
	"path"

	"cornucopia/listah/internal/app/bootstrap"
	"cornucopia/listah/internal/app/category"
	"cornucopia/listah/internal/app/item"
	"cornucopia/listah/internal/app/store"
	"cornucopia/listah/internal/app/user"
	"cornucopia/listah/internal/pkg/middleware"
	v1connect "cornucopia/listah/internal/pkg/proto/listah/v1/v1connect"

	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

func handle(infra *bootstrap.Infra) http.Handler {

	mux := http.NewServeMux()

	// otelconnect.NewInterceptor provides an interceptor that adds tracing and
	// metrics to both clients and handlers. By default, it uses OpenTelemetry's
	// global TracerProvider and MeterProvider, which you can configure by
	// following the OpenTelemetry documentation. If you'd prefer to avoid
	// globals, use otelconnect.WithTracerProvider and
	// otelconnect.WithMeterProvider.
	interceptors := middleware.GetInterceptors(infra)

	//
	// Handle User connect-go generated paths
	userPath, userHandler := v1connect.NewUserServiceHandler(user.NewServer(infra), interceptors)
	mux.Handle(userPath, userHandler)

	//
	// Handle Item Connect-go generated paths
	itemPath, itemHandler := v1connect.NewItemServiceHandler(item.NewServer(infra), interceptors)
	mux.Handle(itemPath, itemHandler)

	//
	// Handle Category Connect-go generated paths
	categoryPath, categoryHandler := v1connect.NewCategoryServiceHandler(category.NewServer(infra), interceptors)
	mux.Handle(categoryPath, categoryHandler)

	//
	// Handle Store Connect-go generated paths
	storePath, storeHandler := v1connect.NewStoreServiceHandler(store.NewServer(infra), interceptors)
	mux.Handle(storePath, storeHandler)

	//
	// Handle OpenAPI docs files
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		p := path.Join(infra.Config.ProjectRoot, "public", "index.html")
		http.ServeFile(w, r, p)
	})

	return h2c.NewHandler(mux, &http2.Server{})
}
