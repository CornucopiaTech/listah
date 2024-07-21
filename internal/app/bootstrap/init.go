package bootstrap

import (
	"cornucopia/listah/internal/pkg/config"
	"cornucopia/listah/internal/pkg/logging"
	"cornucopia/listah/internal/pkg/repository"
	"log"

	"github.com/uptrace/opentelemetry-go-extra/otelzap"
)

type Infra struct {
	Logger     *logging.Factory
	OtelLogger *otelzap.Logger
	Config     *config.Config
	Repository *repository.Repository
}

func InitInfra() *Infra {
	cfgs, err := config.Init()
	if err != nil {
		log.Fatalf("cannot read config file")
	}

	logger, err := logging.Init()
	if err != nil {
		log.Fatalf("cannot create logging factory logger")
	}
	otelLogger, err := logging.InitOtelZap()
	if err != nil {
		log.Fatalf("cannot create otel logger")
	}

	repo := repository.Init(cfgs, logger)

	// ToDo: Define metrics
	// //
	// // Define Metrics
	// metricsFactory = prometheus.New().Namespace(metrics.NSOptions{Name: "hotrod", Tags: nil})

	return &Infra{
		Config:     cfgs,
		Logger:     logger,
		OtelLogger: otelLogger,
		Repository: repo,
	}

}
