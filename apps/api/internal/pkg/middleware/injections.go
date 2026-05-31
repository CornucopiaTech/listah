package middleware

import (
	"context"
	"cornucopia/listah/internal/app/bootstrap"

	"connectrpc.com/connect"
	"github.com/google/uuid"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/propagation"
)

const tokenHeader = "Acme-Token"


func SetParentTraceInterceptor(infra *bootstrap.Infra) connect.UnaryInterceptorFunc {
	// Create a new Middleware/interceptor
	interceptor := func(next connect.UnaryFunc) connect.UnaryFunc {
		// Define the handlerFunc which is called by the server eventually
		handler := connect.UnaryFunc(func(
			ctx context.Context,
			req connect.AnyRequest,
		) (connect.AnyResponse, error) {
			// Log request in db in middleware
			propagator := otel.GetTextMapPropagator()
			ctx = propagator.Extract(ctx, propagation.HeaderCarrier(req.Header()))

			// Call the next middleware/handler in chain
			return next(ctx, req)
		})
		// Return newly created handler
		return handler
	}
	// Return newly created middleware
	return connect.UnaryInterceptorFunc(interceptor)
}

func SetRequestIdInterceptor(infra *bootstrap.Infra) connect.UnaryInterceptorFunc {
	// Create a new Middleware/interceptor
	interceptor := func(next connect.UnaryFunc) connect.UnaryFunc {
		// Define the handlerFunc which is called by the server eventually
		handler := connect.UnaryFunc(func(
			ctx context.Context,
			req connect.AnyRequest,
		) (connect.AnyResponse, error) {
			if val := ctx.Value(trackingIdKey); val == nil {
				// Add requestId to request only if it does not exist
				tid := "req_" + uuid.Must(uuid.NewV7()).String()
				ctx = context.WithValue(ctx, "trackingId", tid)
			}
			return next(ctx, req)
		})
		// Return newly created handler
		return handler
	}
	// Return newly created middleware
	return connect.UnaryInterceptorFunc(interceptor)
}
