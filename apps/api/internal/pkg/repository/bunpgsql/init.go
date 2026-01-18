package bunpgsql

import (
	"cornucopia/listah/apps/api/internal/pkg/config"
	"cornucopia/listah/apps/api/internal/pkg/logging"
	"fmt"
	"time"

	"github.com/pkg/errors"

	"log"

	"github.com/uptrace/opentelemetry-go-extra/otelsql"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

type Repository struct {
	DB       *bun.DB
	ApiLog   ApiLog
	Item     Item
	Category Category
	Tag Tag
}

func Init(cfg *config.Config, logger *logging.Factory) *Repository {
	var disableTls bool

	switch cfg.Env {
	case "LOCAL":
		disableTls = true
	default:
		disableTls = false
	}
	fmt.Printf("DisableTls TLS is: %v\n", disableTls)

	pgconn := pgdriver.NewConnector(
		pgdriver.WithNetwork("tcp"),
		pgdriver.WithAddr(cfg.PgsqlDB.Address),
		pgdriver.WithInsecure(disableTls),
		pgdriver.WithUser(cfg.PgsqlDB.User),
		pgdriver.WithPassword(cfg.PgsqlDB.Password),
		pgdriver.WithDatabase(cfg.PgsqlDB.DatabaseName),
		pgdriver.WithApplicationName(cfg.AppName),
		pgdriver.WithTimeout(5*time.Second),
		pgdriver.WithDialTimeout(5*time.Second),
		pgdriver.WithReadTimeout(5*time.Second),
		pgdriver.WithWriteTimeout(5*time.Second),
	)

	sqldb := otelsql.OpenDB(pgconn)

	db := bun.NewDB(sqldb, pgdialect.New())

	if err := db.Ping(); err != nil {
		log.Printf("unable to ping database.")
		log.Fatal(errors.Cause(err))
	}

	return &Repository{
		DB:       db,
		ApiLog:   &apilog{db: db, logger: logger},
		Item:     &item{db: db, logger: logger},
		Category:     &category{db: db, logger: logger},
		Tag:     &tag{db: db, logger: logger},
	}

}
