package bootstrap

import (
	"cornucopia/listah/internal/pkg/config"
	"cornucopia/listah/internal/pkg/logging"
	"log"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var (
	logger *zap.Logger
	// metricsFactory metrics.Factory
)

type Infra struct {
	Logger logging.Factory
	Config *config.Config
}

func InitInfra() *Infra {
	cfgs, err := config.Init()
	if err != nil {
		log.Fatalf("cannot read config file")
	}
	zapOptions := []zap.Option{
		zap.AddStacktrace(zapcore.FatalLevel),
		zap.AddCallerSkip(1),
	}
	logger, _ = zap.NewDevelopment(zapOptions...)

	zapLogger := logger.With(zap.String("service", "listah"))
	lgr := logging.NewFactory(zapLogger)

	// ToDo: Define metrics
	// //
	// // Define Metrics
	// metricsFactory = prometheus.New().Namespace(metrics.NSOptions{Name: "hotrod", Tags: nil})

	return &Infra{
		Config: cfgs,
		Logger: lgr,
	}

}
