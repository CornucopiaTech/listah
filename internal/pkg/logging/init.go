package logging

import (
	// "log"

	"log"
	"os"
	"time"

	"github.com/sirupsen/logrus"
	"github.com/uptrace/opentelemetry-go-extra/otelzap"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func Init() (*Factory, error) {
	zapOptions := []zap.Option{
		zap.AddStacktrace(zapcore.FatalLevel),
		zap.AddCallerSkip(1),
	}
	var logger *zap.Logger
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

func InitLogrus() *logrus.Logger {
	log := logrus.New()
	log.Level = logrus.DebugLevel
	log.Formatter = &logrus.JSONFormatter{
		FieldMap: logrus.FieldMap{
			logrus.FieldKeyTime:  "timestamp",
			logrus.FieldKeyLevel: "severity",
			logrus.FieldKeyMsg:   "message",
		},
		TimestampFormat: time.RFC3339Nano,
	}
	log.Out = os.Stdout
	return log
}
