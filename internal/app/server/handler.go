package server

import (
	"net/http"
	"path"

	connectcors "connectrpc.com/cors"
	"github.com/rs/cors"

	"cornucopia/listah/internal/app/bootstrap"
	itemV1 "cornucopia/listah/internal/app/item/v1"
	"cornucopia/listah/internal/pkg/middleware"
	"cornucopia/listah/internal/pkg/proto/v1/v1connect"

	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
)

// withCORS adds CORS support to a Connect HTTP handler.
func withCORS(h http.Handler, i *bootstrap.Infra) http.Handler {
	middleware := cors.New(cors.Options{
		AllowedOrigins: []string{i.Config.Web.Address},
		AllowedMethods: connectcors.AllowedMethods(),
		AllowedHeaders: connectcors.AllowedHeaders(),
		ExposedHeaders: connectcors.ExposedHeaders(),
	})
	return middleware.Handler(h)
}

func withHandlerFunc(m *http.ServeMux, p string, hf func(http.ResponseWriter, *http.Request), i *bootstrap.Infra) {
	// Configure the "http.route" for the HTTP instrumentation.
	h := otelhttp.WithRouteTag(p, http.HandlerFunc(hf))
	h = withCORS(h, i)
	m.Handle(p, h)
}

func withHandler(m *http.ServeMux, p string, hr http.Handler, i *bootstrap.Infra) {
	// Configure the "http.route" for the HTTP instrumentation.
	h := otelhttp.WithRouteTag(p, hr)
	h = withCORS(h, i)
	m.Handle(p, h)
}

func handle(i *bootstrap.Infra) http.Handler {

	mux := http.NewServeMux()
	icp := middleware.GetInterceptors(i)

	//
	// Handle User connect-go generated paths
	ip, ih := v1connect.NewItemServiceHandler(itemV1.NewServer(i), icp)
	withHandler(mux, ip, ih, i)

	handleDoc := func(w http.ResponseWriter, r *http.Request) {
		p := path.Join(i.Config.ProjectRoot, "public", "index.html")
		http.ServeFile(w, r, p)
	}

	//
	// Handle OpenAPI docs files
	withHandlerFunc(mux, "/", handleDoc, i)

	return otelhttp.NewHandler(mux, "/")
}
