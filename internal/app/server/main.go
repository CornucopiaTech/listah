package server

import (
	"context"
	"errors"
	"net"
	"net/http"
	"os"
	"os/signal"
	"time"

	pkgErrors "github.com/pkg/errors"

	"cornucopia/listah/internal/app/bootstrap"
	"cornucopia/listah/internal/pkg/telemetry"

	"go.uber.org/zap"
)

func Run() error {
	//
	// Run application bootstrapping
	infra := bootstrap.InitInfra()

	//
	// Handle SIGINT (CTRL+C) gracefully.
	_, stop := signal.NotifyContext(context.Background(), os.Interrupt)
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

	// //
	// // Start serving
	// infra.OtelLogger.Info("server listening at %v", zap.String("address", infra.Config.Api.Address))
	// infra.Logger.Bg().Info("server listening at %v", zap.String("address", infra.Config.Api.Address))
	// // if err = srv.Serve(lis); err != nil && !pkgErrors.Is(err, http.ErrServerClosed) {
	// // 	infra.OtelLogger.Fatal("server failed to serve", zap.Error(pkgErrors.WithStack(err)))
	// // 	infra.Logger.Bg().Fatal("server failed to serve", zap.Error(pkgErrors.WithStack(err)))
	// // }

	srvErr := make(chan error, 1)
	go func() {
		srvErr <- srv.Serve(lis)
	}()

	// Wait for interruption.
	select {
	case err = <-srvErr:
		// Error when starting HTTP server.
		if err != nil && !pkgErrors.Is(err, http.ErrServerClosed) {
			infra.OtelLogger.Fatal("server failed to serve", zap.Error(pkgErrors.WithStack(err)))
			infra.Logger.Bg().Fatal("server failed to serve", zap.Error(pkgErrors.WithStack(err)))
		}

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
