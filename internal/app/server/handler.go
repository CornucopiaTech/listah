package server

import (
	"log"
	"net/http"
	"path"

	"cornucopia/listah/internal/app/bootstrap"
	"cornucopia/listah/internal/app/category"
	"cornucopia/listah/internal/app/item"
	"cornucopia/listah/internal/app/store"
	"cornucopia/listah/internal/app/user"
	v1connect "cornucopia/listah/internal/pkg/proto/listah/v1/v1connect"

	"connectrpc.com/connect"
	"connectrpc.com/otelconnect"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

func handle(infra *bootstrap.Infra) http.Handler {

	mux := http.NewServeMux()

	// The generated constructors return a path and a plain net/http
	// handler.
	intcpt, err := otelconnect.NewInterceptor()
	if err != nil {
		log.Fatal(err)
	}

	// otelconnect.NewInterceptor provides an interceptor that adds tracing and
	// metrics to both clients and handlers. By default, it uses OpenTelemetry's
	// global TracerProvider and MeterProvider, which you can configure by
	// following the OpenTelemetry documentation. If you'd prefer to avoid
	// globals, use otelconnect.WithTracerProvider and
	// otelconnect.WithMeterProvider.

	//
	// Handle User connect-go generated paths
	userPath, userHandler := v1connect.NewUserServiceHandler(
		user.NewServer(infra),
		connect.WithInterceptors(intcpt))
	mux.Handle(userPath, userHandler)

	//
	// Handle Item Connect-go generated paths
	itemPath, itemHandler := v1connect.NewItemServiceHandler(
		item.NewServer(infra),
		connect.WithInterceptors(intcpt))
	mux.Handle(itemPath, itemHandler)

	//
	// Handle Category Connect-go generated paths
	categoryPath, categoryHandler := v1connect.NewCategoryServiceHandler(
		category.NewServer(infra),
		connect.WithInterceptors(intcpt))
	mux.Handle(categoryPath, categoryHandler)

	//
	// Handle Store Connect-go generated paths
	storePath, storeHandler := v1connect.NewStoreServiceHandler(
		store.NewServer(infra),
		connect.WithInterceptors(intcpt))
	mux.Handle(storePath, storeHandler)

	//
	// Handle OpenAPI docs files
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		p := path.Join(infra.Config.ProjectRoot, "public", "index.html")
		http.ServeFile(w, r, p)
	})

	return h2c.NewHandler(mux, &http2.Server{})
}
