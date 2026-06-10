package utils

import (
	"connectrpc.com/connect"
	"context"
	"github.com/google/uuid"
	"go.opentelemetry.io/otel/trace"
	"time"

	"cornucopia/listah/internal/app/bootstrap"
	model "cornucopia/listah/internal/pkg/model/v1"
)

const TrackingIdKey = "trackingId"

func HandleError(infra *bootstrap.Infra, ctx context.Context, req connect.AnyRequest, err error) *connect.Error {
	reqId := GetRequestId(ctx)
	recordError(infra, ctx, req, err, reqId)
	e := getError(err, reqId)
	return e
}

func GetRequestId(ctx context.Context) string {
	// Log request in db in middleware
	tid := ""
	if val := ctx.Value(TrackingIdKey); val != nil {
		// Type assert the value back to a string safely
		if strVal, ok := val.(string); ok {
			tid = strVal
		}
	}
	if tid == "" {
		tid = "req_" + uuid.Must(uuid.NewV7()).String()
	}
	return tid
}

func GetDbRequest(req connect.AnyRequest) model.DbReq {
	headerMap := make(map[string]string)
	for key := range req.Header() {
		headerMap[key] = req.Header().Get(key)
	}
	return model.DbReq{Msg: req, Header: headerMap}
}

func recordError(infra *bootstrap.Infra, ctx context.Context, req connect.AnyRequest, err error, reqId string) {
	reqModel := model.ErrorLog{
		Id:            reqId,
		RequestSource: "api",
		Method:        req.Spec().Procedure, // e.g., "/app.v1.users.UserService/CreateUser"
		TraceId:       trace.SpanFromContext(ctx).SpanContext().TraceID().String(),
		SpanId:        trace.SpanFromContext(ctx).SpanContext().SpanID().String(),
		Code:          connect.CodeOf(err).String(),
		Error:         err.Error(),
		ResponseTime:  time.Now().UTC(),
		Request:       GetDbRequest(req),
	}
	dctx := context.WithoutCancel(ctx)
	go infra.BunRepo.ApiLog.Insert(dctx, &reqModel)
}
