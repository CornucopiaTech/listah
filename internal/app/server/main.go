package server

import (
	"context"
	"errors"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"time"

	"cornucopia/listah/internal/app/bootstrap"
	"cornucopia/listah/internal/app/user"
	v1connect "cornucopia/listah/internal/pkg/proto/listah/v1/v1connect"

	"connectrpc.com/connect"
	"connectrpc.com/otelconnect"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

func Run() error {
	// Run application bootstrapping
	infra := bootstrap.Init()

	// Handle SIGINT (CTRL+C) gracefully.
	_, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	// Set up OpenTelemetry.
	otelShutdown, err := initSDK()
	if err != nil {
		return err
	}
	// Handle shutdown properly so nothing leaks.
	defer func() {
		err = errors.Join(err, otelShutdown(context.Background()))
	}()

	// The generated constructors return a path and a plain net/http
	// handler.
	intcpt, err := otelconnect.NewInterceptor()
	if err != nil {
		log.Fatal(err)
	}
	mux := http.NewServeMux()

	// otelconnect.NewInterceptor provides an interceptor that adds tracing and
	// metrics to both clients and handlers. By default, it uses OpenTelemetry's
	// global TracerProvider and MeterProvider, which you can configure by
	// following the OpenTelemetry documentation. If you'd prefer to avoid
	// globals, use otelconnect.WithTracerProvider and
	// otelconnect.WithMeterProvider.
	path, handler := v1connect.NewUserServiceHandler(&user.Server{}, connect.WithInterceptors(
		intcpt,
	))
	mux.Handle(path, handler)

	// Start HTTP server.
	srv := &http.Server{
		Addr:         infra.Config.Api.Address,
		BaseContext:  func(_ net.Listener) context.Context { return context.Background() },
		ReadTimeout:  time.Second,
		WriteTimeout: 10 * time.Second,
		Handler:      h2c.NewHandler(mux, &http2.Server{}),
	}
	srvErr := make(chan error, 1)
	go func() {
		srvErr <- srv.ListenAndServe()
	}()

	// Wait for interruption.
	select {
	case err = <-srvErr:
		// Error when starting HTTP server.
		return err
	case <-context.Background().Done():
		// Wait for first CTRL+C.
		// Stop receiving signal notifications as soon as possible.
		stop()
	}

	// When Shutdown is called, ListenAndServe immediately returns ErrServerClosed.
	err = srv.Shutdown(context.Background())
	return err
}
