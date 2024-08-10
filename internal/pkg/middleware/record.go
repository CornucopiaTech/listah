package middleware

import (
	"context"
	"cornucopia/listah/internal/app/bootstrap"
	"cornucopia/listah/internal/pkg/model"
	"errors"

	"connectrpc.com/connect"
	"github.com/google/uuid"
	"go.opentelemetry.io/otel/trace"
)

const tokenHeader = "Acme-Token"

func NewAuthInterceptor() connect.UnaryInterceptorFunc {
	interceptor := func(next connect.UnaryFunc) connect.UnaryFunc {
		return connect.UnaryFunc(func(
			ctx context.Context,
			req connect.AnyRequest,
		) (connect.AnyResponse, error) {
			if req.Spec().IsClient {
				// Send a token with client requests.
				req.Header().Set(tokenHeader, "sample")
			} else if req.Header().Get(tokenHeader) == "" {
				// Check token in handlers.
				return nil, connect.NewError(
					connect.CodeUnauthenticated,
					errors.New("no token provided"),
				)
			}
			return next(ctx, req)
		})
	}
	return connect.UnaryInterceptorFunc(interceptor)
}

func RecordRequestInterceptor(infra *bootstrap.Infra) connect.UnaryInterceptorFunc {
	// Create a new Middleware/interceptor
	interceptor := func(next connect.UnaryFunc) connect.UnaryFunc {
		// Define the handlerFunc which is called by the server eventually
		handler := connect.UnaryFunc(func(
			ctx context.Context,
			req connect.AnyRequest,
		) (connect.AnyResponse, error) {
			// ... do middleware things

			reqModel := model.ApiLog{
				Id:      uuid.Must(uuid.NewV7()).String(),
				TraceId: trace.SpanFromContext(ctx).SpanContext().TraceID().String(),
				SpanId:  trace.SpanFromContext(ctx).SpanContext().SpanID().String(),
				Request: req,
			}
			infra.Repository.ApiLog.InsertOne(ctx, &reqModel)

			// Call the next middleware/handler in chain
			return next(ctx, req)
		})
		// Return newly created handler
		return handler
	}
	// Return newly created middleware
	return connect.UnaryInterceptorFunc(interceptor)
}
