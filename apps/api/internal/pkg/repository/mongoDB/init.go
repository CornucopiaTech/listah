package mongoDB

import (
	"context"
	"cornucopia/listah/internal/pkg/config"
	"cornucopia/listah/internal/pkg/logging"
	"fmt"
	"log"
	"strings"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.mongodb.org/mongo-driver/v2/mongo/readpref"
)

type Repository struct {
	Client *mongo.Client
	Item   Item
	Tag    Tag
	ApiLog ApiLog
}

// type repoAgent struct {
// 	logger     *logging.Factory
// 	client     *mongo.Client
// 	collection *mongo.Collection
// }

func Init(cfg *config.Config, logger *logging.Factory) *Repository {
	var disableTls bool

	switch strings.ToUpper(cfg.Env) {
	case "LOCAL":
		disableTls = true
	default:
		disableTls = false
	}
	fmt.Printf("DisableTls TLS is: %v\n", disableTls)

	// Create client connection
	clientOpts := options.Client()
	clientOpts.ApplyURI(cfg.MongoDB.ConnectionString)
	clientOpts.SetAuth(cfg.MongoDB.AuthCredentials)

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
		Item: &itemAgent{
			client:     client,
			logger:     logger,
			collection: client.Database(cfg.MongoDB.DatabaseName).Collection("Items"),
		},
		Tag: &tagAgent{
			client:     client,
			logger:     logger,
			collection: client.Database(cfg.MongoDB.DatabaseName).Collection("Items"),
		},
		ApiLog: &apiLogAgent{
			client:     client,
			logger:     logger,
			collection: client.Database(cfg.MongoDB.DatabaseName).Collection("ApiLogs"),
		},
	}

}
