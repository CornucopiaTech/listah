package repository

import (
	// "fmt"
	"context"
	"strings"
	"cornucopia/listah/internal/pkg/logging"
	"cornucopia/listah/internal/pkg/model"

	"github.com/pkg/errors"
	// "go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

type EmptyInterface []interface{}

type ItemRepository interface {
	ReadOne(ctx context.Context, repoModel *model.Item, readFilter map[string]string) error
	ReadMany(ctx context.Context, repoModel *model.Items, readFilter any) error
	InsertOne(ctx context.Context, repoModel *model.Item) (string, error)
	InsertMany(ctx context.Context, repoModel *[]interface{}) ([]string, error)

}

type itemRepositoryAgent struct {
	logger     *logging.Factory
	client     *mongo.Client
	collection *mongo.Collection
}

func (a *itemRepositoryAgent) ReadOne(ctx context.Context, repoModel *model.Item, readFilter map[string]string) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "Read one")
	defer span.End()
	a.logger.For(ctx).Info("Reading one from item by filter", zap.Object("filter", repoModel))

	err := a.collection.FindOne(ctx, readFilter).Decode(repoModel)
	if errors.Is(err, mongo.ErrNoDocuments) {
		a.logger.For(ctx).Error("Document could not be found for given filter", zap.Object("filter", repoModel), zap.String("cause", errors.Cause(err).Error()))
		return err
	} else if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while reading one from item using filter", zap.Object("filter", repoModel), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}

func (a *itemRepositoryAgent) ReadMany(ctx context.Context, repoModel *model.Items, readFilter any) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "Read many")
	defer span.End()
	a.logger.For(ctx).Info("Reading many from item by filter", zap.Object("filter", repoModel))

	cursor, err := a.collection.Find(ctx, readFilter)
	if errors.Is(err, mongo.ErrNoDocuments) {
		a.logger.For(ctx).Error("Document could not be found for given filter", zap.Object("filter", repoModel), zap.String("cause", errors.Cause(err).Error()))
		return err
	} else if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while reading many from item using filter", zap.Object("filter", repoModel), zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	if err := cursor.All(context.TODO(), repoModel); err != nil {
		a.logger.For(ctx).Error("Error occurred while marshalling find results into model", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *itemRepositoryAgent) InsertOne(ctx context.Context, repoModel *model.Item) (string, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "insert one")
	defer span.End()
	a.logger.For(ctx).Info("Inserting one into item")

	res, err := a.collection.InsertOne(ctx, repoModel)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting one into item", zap.String("cause", errors.Cause(err).Error()))
		return "", err
	}

	insertedId, ok := res.InsertedID.(string)
	if !ok {
		a.logger.For(ctx).Error("Unexpected type returned after inserting one into item", zap.String("cause", errors.Cause(err).Error()))
		return "", nil
	}

	return insertedId, nil
}

func (a *itemRepositoryAgent) InsertMany(ctx context.Context, repoModel *[]interface{} )  ([]string, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "insert many")
	defer span.End()
	a.logger.For(ctx).Info("Inserting many into item")


	// fmt.Print("\n\nData to be inserted: ")
	// fmt.Print(*repoModel)
	queryOpts := options.InsertMany().SetOrdered(false)
	res, err := a.collection.InsertMany(ctx, *repoModel, queryOpts)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting many into item", zap.String("cause", errors.Cause(err).Error()))
		return nil, err
	}

	var insertions = []string{}
	for _, iValue := range res.InsertedIDs {
		insertions = append(insertions, iValue.(string))
	}

	if strings.Join(insertions, "") == "" {
		a.logger.For(ctx).Error("Unexpected type returned after inserting one into item", zap.String("cause", errors.Cause(err).Error()))
		return nil, nil
	}

	return insertions, nil
}
