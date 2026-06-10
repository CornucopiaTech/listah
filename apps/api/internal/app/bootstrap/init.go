package bootstrap

import (
	"github.com/sirupsen/logrus"
	"github.com/uptrace/opentelemetry-go-extra/otelzap"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/trace"
	"log"

	"cornucopia/listah/internal/pkg/config"
	"cornucopia/listah/internal/pkg/logging"
	"cornucopia/listah/internal/pkg/repository/bunpgsql"
	"cornucopia/listah/internal/pkg/repository/redissrv"
)

type Infra struct {
	Logger     *logging.Factory
	Logrus     *logrus.Logger
	OtelLogger *otelzap.Logger
	Config     *config.Config
	BunRepo    *bunpgsql.Repository
	RedisCache *redissrv.Cache
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

	bunrepo := bunpgsql.Init(cfgs, logger)

	lgrus := logging.InitLogrus()
	// rCache := redissrv.Init(cfgs, logger)

	// ToDo: Define metrics
	// //
	// // Define Metrics
	// metricsFactory = prometheus.New().Namespace(metrics.NSOptions{Name: "hotrod", Tags: nil})

	return &Infra{
		Config:     cfgs,
		Logger:     logger,
		OtelLogger: otelLogger,
		BunRepo:    bunrepo,
		Logrus:     lgrus,
		Tracer:     otel.Tracer(cfgs.AppName),
		// RedisCache:   rCache,
	}

}
