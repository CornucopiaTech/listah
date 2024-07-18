package logging

import (
	"log"

	"github.com/uptrace/opentelemetry-go-extra/otelzap"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var (
	logger *zap.Logger
)

func Init() (*Factory, error) {
	zapOptions := []zap.Option{
		zap.AddStacktrace(zapcore.FatalLevel),
		zap.AddCallerSkip(1),
	}
	logger, _ = zap.NewProduction(zapOptions...)
	// logger, _ = zap.NewDevelopment(zapOptions...)

	zapLogger := logger.With(zap.String("service", "listah"))
	log := NewFactory(zapLogger)

	return &log, nil
}

func InitOtelZap() (*otelzap.Logger, error) {
	zapOptions := []zap.Option{
		zap.AddStacktrace(zapcore.FatalLevel),
		zap.AddCallerSkip(1),
	}

	// Wrap zap logger to extend Zap with API that accepts a context.Context.
	zapLogger, err := zap.NewProduction(zapOptions...)
	if err != nil {
		log.Fatal("unable to start zap logger")
	}
	log := otelzap.New(zapLogger, otelzap.WithCallerDepth(1), otelzap.WithStackTrace(true))

	return log, nil
}
