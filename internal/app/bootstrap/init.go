package bootstrap

import (
	"cornucopia/listah/internal/pkg/logging"
	"log"

	"cornucopia/listah/internal/pkg/config"
)

type Infra struct {
	Logger logging.Factory
	Config *config.Config
}

func Init() *Infra {
	cfgs, err := config.Init()
	if err != nil {
		log.Fatalf("cannot read config file")
	}
	return &Infra{
		Config: cfgs,
	}

}
