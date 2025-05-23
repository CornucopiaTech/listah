package logging

import (
	"context"

	"go.opentelemetry.io/otel/trace"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// Factory is the default logging wrapper that can create
// logger instances either for a given Context or context-less.
type Factory struct {
	logger *zap.Logger
}

// NewFactory creates a new Factory.
func NewFactory(logger *zap.Logger) Factory {
	return Factory{logger: logger}
}

// Bg creates a context-unaware logger.
func (b Factory) Bg() Logger {
	return wrapper(b)
}

// For returns a context-aware Logger. If the context
// contains an OpenTracing span, all logging calls are also
// echo-ed into the span.
func (b Factory) For(ctx context.Context) Logger {
	if otelSpan := trace.SpanFromContext(ctx); otelSpan != nil {
		logger := spanLogger{span: otelSpan, logger: b.logger}
		logger.spanFields = []zapcore.Field{
			zap.String("trace_id", otelSpan.SpanContext().TraceID().String()),
			zap.String("span_id", otelSpan.SpanContext().SpanID().String()),
		}
		return logger
	}
	return b.Bg()
}

// With creates a child logger, and optionally adds some context fields to that logger.
func (b Factory) With(fields ...zapcore.Field) Factory {
	return Factory{logger: b.logger.With(fields...)}
}
