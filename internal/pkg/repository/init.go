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

	// "go.mongodb.org/mongo-driver/bson"
	// "go.mongodb.org/mongo-driver/mongo"
	// "go.mongodb.org/mongo-driver/mongo/options"
	// "go.mongodb.org/mongo-driver/mongo/readpref"

	// "go.opentelemetry.io/contrib/instrumentation/go.mongodb.org/mongo-driver/mongo/otelmongo"
)

type Repository struct {
	Client *mongo.Client
	// User     UserRepository
	Item ItemRepository
	// Category CategoryRepository
	// Store    StoreRepository
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
		// User: &repositoryAgent{
		// 	client:     &client,
		// 	logger:     logger,
		// 	ctx:        &ctx,
		// 	collection: &client.Collection("Users"),
		// },
		Item: &itemRepositoryAgent{
			client:     client,
			logger:     logger,
			collection: client.Database(cfg.Database.DatabaseName).Collection("Items"),
		},
		// Category: &repositoryAgent{
		// 	client:     &client,
		// 	logger:     logger,
		// 	ctx:        &ctx,
		// 	collection: &client.Collection("Categories"),
		// },
		// Tag: &repositoryAgent{
		// 	client:     &client,
		// 	logger:     logger,
		// 	ctx:        &ctx,
		// 	collection: &client.Collection("Tags"),
		// },
		ApiLog: &apiLogRepositoryAgent{
			client:     client,
			logger:     logger,
			collection: client.Database(cfg.Database.DatabaseName).Collection("ApiLogs"),
		},
	}

}
