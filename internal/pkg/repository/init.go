package repository

import (
	"context"
	"cornucopia/listah/internal/pkg/config"
	"cornucopia/listah/internal/pkg/logging"
	"fmt"

	"github.com/pkg/errors"

	"log"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.mongodb.org/mongo-driver/v2/mongo/readpref"
)

type Repository struct {
	Client *mongo.Client
	Item ItemRepository
	ApiLog ApiLogRepository
}


type repositoryAgent struct {
	logger     *logging.Factory
	client     *mongo.Client
	collection *mongo.Collection
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

	// Create client connection
	clientOpts := options.Client()
	clientOpts.ApplyURI(cfg.Database.ConnectionString)
	clientOpts.SetAuth(cfg.Database.AuthCredentials)


	client, err := mongo.Connect(clientOpts)
	if err != nil {
		log.Printf("unable to ping database.")
		log.Fatal(errors.Cause(err))
	}

	// Ping database to test connection
	if err := client.Ping(context.Background(), readpref.Primary()); err != nil {
		log.Printf("unable to ping database.")
		log.Fatal(errors.Cause(err))
	}

	return &Repository{
		Client: client,
		Item: &itemRepositoryAgent{
			client:     client,
			logger:     logger,
			collection: client.Database(cfg.Database.DatabaseName).Collection("Items"),
		},
		ApiLog: &apiLogRepositoryAgent{
			client:     client,
			logger:     logger,
			collection: client.Database(cfg.Database.DatabaseName).Collection("ApiLogs"),
		},
	}

}
