package bootstrap

import (
	"cornucopia/listah/internal/pkg/config"
	"cornucopia/listah/internal/pkg/logging"
	"cornucopia/listah/internal/pkg/repository/pgsql"
	"log"

	"github.com/sirupsen/logrus"
	"github.com/uptrace/opentelemetry-go-extra/otelzap"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/trace"
)

type Infra struct {
	Logger     *logging.Factory
	Logrus     *logrus.Logger
	OtelLogger *otelzap.Logger
	Config     *config.Config
	PgRepo     *pgsql.Repository
	Tracer     trace.Tracer
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

	repo := pgsql.Init(cfgs, logger)

	lgrus := logging.InitLogrus()

	// ToDo: Define metrics
	// //
	// // Define Metrics
	// metricsFactory = prometheus.New().Namespace(metrics.NSOptions{Name: "hotrod", Tags: nil})

	return &Infra{
		Config:     cfgs,
		Logger:     logger,
		OtelLogger: otelLogger,
		PgRepo:     repo,
		Logrus:     lgrus,
		Tracer:     otel.Tracer(cfgs.AppName),
	}

}
