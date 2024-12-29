package server

import (
	"context"
	"errors"
	"net"
	"net/http"
	"os"
	"os/signal"
	"time"

	"cornucopia/listah/internal/app/bootstrap"
	"cornucopia/listah/internal/pkg/telemetry"

	"go.uber.org/zap"
)

func Run() error {
	//Following server setup guide in Otel docs: https://opentelemetry.io/docs/languages/go/getting-started/
	// Run application bootstrapping
	infra := bootstrap.InitInfra()

	// //
	// Handle SIGINT (CTRL+C) gracefully.
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	//
	// Set up OpenTelemetry.
	otelShutdown, err := telemetry.InitSDK()
	if err != nil {
		return err
	}

	// Handle shutdown properly so nothing leaks.
	defer func() {
		err = errors.Join(err, otelShutdown(context.Background()))
	}()

	//
	// Get route handler
	handler := handle(infra)

	//
	// Define listener
	lis, err := net.Listen("tcp", infra.Config.Api.Address)
	if err != nil {
		infra.OtelLogger.Fatal("failed to listen", zap.Error(err))
		infra.Logger.Bg().Fatal("failed to listen", zap.Error(err))
	}

	//
	// Define HTTP server
	srv := &http.Server{
		Addr:         infra.Config.Api.Address,
		BaseContext:  func(_ net.Listener) context.Context { return context.Background() },
		ReadTimeout:  time.Second,
		WriteTimeout: 10 * time.Second,
		Handler:      handler,
	}

	// Start  HTTP server
	srvErr := make(chan error, 1)
	go func() {
		srvErr <- srv.Serve(lis)
	}()

	// Wait for interruption.
	select {
	case err = <-srvErr:
		// Error when starting HTTP server.
		return err
	case <-ctx.Done():
		// Wait for first CTRL+C.
		// Stop receiving signal notifications as soon as possible.
		stop()
	}

	// When Shutdown is called, ListenAndServe immediately returns ErrServerClosed.
	err = srv.Shutdown(context.Background())
	return err
}
