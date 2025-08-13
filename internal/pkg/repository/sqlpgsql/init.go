package sqlpgsql

import (
	"cornucopia/listah/internal/pkg/config"
	"cornucopia/listah/internal/pkg/logging"
	"fmt"
	"time"
	"os"
	"context"
	"github.com/pkg/errors"
	"log"
	"database/sql"
	"os/signal"

	// "github.com/uptrace/opentelemetry-go-extra/otelsql"

	// "github.com/uptrace/bun"
	// "github.com/uptrace/bun/dialect/pgdialect"
	// "github.com/uptrace/bun/driver/pgdriver"
	_ "github.com/lib/pq"
)

type Repository struct {
	DB       *sql.DB
	// ApiLog   ApiLog
	// Item     Item
}



func Init(cfg *config.Config, logger *logging.Factory) *Repository {
	var disableTls string

	switch cfg.Env {
		case "PROD":
			disableTls = "verify-full"
		case "TEST":
			disableTls = "verify-full"
		default:
			disableTls = "disable"
	}
	fmt.Printf("DisableTls TLS is: %v\n", disableTls)

	// pgconn := pgdriver.NewConnector(
	// 	pgdriver.WithNetwork("tcp"),
	// 	pgdriver.WithAddr(cfg.PgsqlDB.Address),
	// 	pgdriver.WithInsecure(disableTls),
	// 	pgdriver.WithUser(cfg.PgsqlDB.User),
	// 	pgdriver.WithPassword(cfg.PgsqlDB.Password),
	// 	pgdriver.WithDatabase(cfg.PgsqlDB.DatabaseName),
	// 	pgdriver.WithApplicationName(cfg.AppName),
	// 	pgdriver.WithTimeout(5*time.Second),
	// 	pgdriver.WithDialTimeout(5*time.Second),
	// 	pgdriver.WithReadTimeout(5*time.Second),
	// 	pgdriver.WithWriteTimeout(5*time.Second),
	// )
	// sqldb := otelsql.OpenDB(pgconn)
	// db := bun.NewDB(sqldb, pgdialect.New())

	// if err := db.Ping(); err != nil {
	// 	log.Printf("unable to ping database.")
	// 	log.Fatal(errors.Cause(err))
	// }



	// connStr := fmt.Sprintf("postgres://pqgotest:password@localhost/pqgotest?sslmode=verify-full", key, value)
	connStr := fmt.Sprintf("postgres://%v:%v@%v/%v?sslmode=%v", cfg.PgsqlDB.User, cfg.PgsqlDB.Password, cfg.PgsqlDB.Address, cfg.PgsqlDB.DatabaseName, disableTls)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Printf("unable to connect to database: %v", errors.Cause(err))
		log.Fatalf("unable to connect to database: %v", errors.Cause(err))
	}
	defer db.Close()

	// db.SetConnMaxLifetime(0)
	// db.SetMaxIdleConns(3)
	// db.SetMaxOpenConns(3)

	ctx, stop := context.WithCancel(context.Background())
	defer stop()

	appSignal := make(chan os.Signal, 3)
	signal.Notify(appSignal, os.Interrupt)

	go func() {
		<-appSignal
		stop()
	}()


	ctx, cancel := context.WithTimeout(ctx, 1*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		log.Printf("unable to ping to database: %v", errors.Cause(err))
		log.Fatalf("unable to ping to database: %v", errors.Cause(err))
	}



	return &Repository{
		DB:       db,
		// ApiLog:   &apilog{db: db, logger: logger},
		// Item:     &item{db: db, logger: logger},
	}

}
