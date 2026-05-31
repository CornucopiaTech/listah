package middleware

import (
	"context"
	"time"
	"connectrpc.com/connect"
	"github.com/google/uuid"
	"go.opentelemetry.io/otel/trace"

	"cornucopia/listah/internal/app/bootstrap"
	model "cornucopia/listah/internal/pkg/model/v1"
	"cornucopia/listah/internal/pkg/utils"
)


func RecordRequestInterceptor(infra *bootstrap.Infra) connect.UnaryInterceptorFunc {
	// Create a new Middleware/interceptor
	interceptor := func(next connect.UnaryFunc) connect.UnaryFunc {
		// Define the handlerFunc which is called by the server eventually
		handler := connect.UnaryFunc(func(
			ctx context.Context,
			req connect.AnyRequest,
		) (connect.AnyResponse, error) {
			// Log request in db in middleware
			tid := ""
			if val := ctx.Value(trackingIdKey); val != nil {
				// Type assert the value back to a string safely
				if strVal, ok := val.(string); ok {
					tid = strVal
				}
			}
			if tid == "" {
				tid = "req_" + uuid.Must(uuid.NewV7()).String()
			}
			reqModel := model.ApiLog{
				Id:            tid,
				RequestSource: "api",
				Method: req.Spec().Procedure, // e.g., "/app.v1.users.UserService/CreateUser"
				TraceId:       trace.SpanFromContext(ctx).SpanContext().TraceID().String(),
				SpanId:        trace.SpanFromContext(ctx).SpanContext().SpanID().String(),
				Request:       req,
				RequestTime:   time.Now().UTC(),
			}
			dctx := context.WithoutCancel(ctx)
			go infra.BunRepo.ApiLog.Insert(dctx, &reqModel)

			// Call the next middleware/handler in chain
			return next(ctx, req)
		})
		// Return newly created handler
		return handler
	}
	// Return newly created middleware
	return connect.UnaryInterceptorFunc(interceptor)
}


func RecordErrorResponseInterceptor(infra *bootstrap.Infra) connect.UnaryInterceptorFunc {
	// Create a new Middleware/interceptor
	interceptor := func(next connect.UnaryFunc) connect.UnaryFunc {
		// Define the handlerFunc which is called by the server eventually
		handler := connect.UnaryFunc(func(
			ctx context.Context,
			req connect.AnyRequest,
		) (connect.AnyResponse, error) {
			// Call the next middleware/handler in chain
			res, err := next(ctx, req)
			if err != nil {
				// Log request in db in middleware
				tid := ""
				if val := ctx.Value(trackingIdKey); val != nil {
					// Type assert the value back to a string safely
					if strVal, ok := val.(string); ok {
						tid = strVal
					}
				}
				if tid == "" {
					tid = "req_" + uuid.Must(uuid.NewV7()).String()
				}
				reqModel := model.ErrorLog{
					Id:            tid,
					RequestSource: "api",
					Method: req.Spec().Procedure, // e.g., "/app.v1.users.UserService/CreateUser"
					TraceId:       trace.SpanFromContext(ctx).SpanContext().TraceID().String(),
					SpanId:        trace.SpanFromContext(ctx).SpanContext().SpanID().String(),
					Code: connect.CodeOf(err).String(),
					Error: err.Error(),
					ResponseTime:   time.Now().UTC(),
					Request:       req,

				}
				dctx := context.WithoutCancel(ctx)
				go infra.BunRepo.ApiLog.Insert(dctx, &reqModel)

				// 4. Return sanitized error structure back to frontend (using our pattern from before)
				return nil, utils.HandleError(err)
			}
			return res, nil
		})
		// Return newly created handler
		return handler
	}
	// Return newly created middleware
	return connect.UnaryInterceptorFunc(interceptor)
}
