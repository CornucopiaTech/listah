package logging

import (
	"context"
	"time"

	"go.uber.org/zap"
)

func (l *Factory) LogInfo(ctx context.Context, svc string, svcr string, msg string) {
	l.For(ctx).Info(
		msg,
		zap.String("svc", svc),
		zap.String("rpc", svcr),
		zap.String("timestamp", time.Now().Format(time.RFC3339)),
	)
}

func (l *Factory) LogDebug(ctx context.Context, svc string, svcr string, msg string) {
	l.For(ctx).Debug(
		msg,
		zap.String("svc", svc),
		zap.String("rpc", svcr),
		zap.String("timestamp", time.Now().Format(time.RFC3339)),
	)
}

func (l *Factory) LogError(ctx context.Context, svc string, svcr string, msg string, cs string) {
	l.For(ctx).Error(
		msg,
		zap.String("svc", svc),
		zap.String("rpc", svcr),
		zap.String("timestamp", time.Now().Format(time.RFC3339)),
		zap.String("cause", cs),
	)
}
