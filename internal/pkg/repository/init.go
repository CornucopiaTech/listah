package repository

import (
	"cornucopia/listah/internal/pkg/config"
	"cornucopia/listah/internal/pkg/logging"
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
	Db    *bun.DB
	Users UserRepository
}

func Init(cfg *config.Config, logger *logging.Factory) *Repository {
	var enableTls bool

	switch cfg.Env {
	case "PROD":
		enableTls = false
	case "TEST":
		enableTls = false
	default:
		enableTls = true
	}
	fmt.Printf("Enable TLS is: %v\n", enableTls)

	pgconn := pgdriver.NewConnector(
		pgdriver.WithNetwork("tcp"),
		pgdriver.WithAddr(cfg.Database.Address),
		pgdriver.WithInsecure(enableTls),
		// pgdriver.WithTLSConfig(&tls.Config{InsecureSkipVerify: false}),
		// pgdriver.WithTLSConfig(&tls.Config{InsecureSkipVerify: true}),
		pgdriver.WithUser(cfg.Database.User),
		pgdriver.WithPassword(cfg.Database.Password),
		pgdriver.WithDatabase(cfg.Database.DatabaseName),
		pgdriver.WithApplicationName(cfg.AppName),
		pgdriver.WithTimeout(5*time.Second),
		pgdriver.WithDialTimeout(5*time.Second),
		pgdriver.WithReadTimeout(5*time.Second),
		pgdriver.WithWriteTimeout(5*time.Second),
		// pgdriver.WithConnParams(map[string]interface{}{
		// 	"search_path": "my_search_path",
		// }),
	)

	sqldb := otelsql.OpenDB(pgconn)

	db := bun.NewDB(sqldb, pgdialect.New())

	if err := db.Ping(); err != nil {
		log.Printf("unable to ping database.")
		log.Fatal(errors.Cause(err))
	}

	return &Repository{
		Db:    db,
		Users: &userRepositoryAgent{db: db, logger: logger},
	}

}