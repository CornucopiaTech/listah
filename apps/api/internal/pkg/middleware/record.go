package middleware

import (
	"connectrpc.com/connect"
	"context"
	"go.opentelemetry.io/otel/trace"
	"time"

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
			tid := utils.GetRequestId(ctx)
			reqModel := model.ApiLog{
				Id:            tid,
				RequestSource: "api",
				Method:        req.Spec().Procedure, // e.g., "/app.v1.users.UserService/CreateUser"
				TraceId:       trace.SpanFromContext(ctx).SpanContext().TraceID().String(),
				SpanId:        trace.SpanFromContext(ctx).SpanContext().SpanID().String(),
				Request:       utils.GetDbRequest(req),
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
				e := utils.HandleError(infra, ctx, req, err)
				return nil, e
			}
			return res, nil
		})
		// Return newly created handler
		return handler
	}
	// Return newly created middleware
	return connect.UnaryInterceptorFunc(interceptor)
}
