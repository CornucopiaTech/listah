package mongoDB

import (
	// "fmt"
	"context"
	// "strings"
	"cornucopia/listah/internal/pkg/logging"
	v1model "cornucopia/listah/internal/pkg/model/v1"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

type EmptyInterface []interface{}

type Item interface {
	Read(ctx context.Context, m *[]*v1model.Item, readFilter any) error
	Insert(ctx context.Context, m []*v1model.Item) ([]string, error)
	Upsert(ctx context.Context, m []*v1model.Item ) error
}

type itemAgent struct {
	logger     *logging.Factory
	client     *mongo.Client
	collection *mongo.Collection
}

func (a *itemAgent) Read(ctx context.Context, m *[]*v1model.Item, readFilter any) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "Read many")
	defer span.End()
	a.logger.For(ctx).Info("Reading many from item by filter")

	cursor, err := a.collection.Find(ctx, readFilter)
	if errors.Is(err, mongo.ErrNoDocuments) {
		a.logger.For(ctx).Error("Document could not be found for given filter", zap.String("cause", errors.Cause(err).Error()))
		return err
	} else if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while reading many from item using filter", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	if err := cursor.All(context.TODO(), m); err != nil {
		a.logger.For(ctx).Error("Error occurred while marshalling find results into model", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}


func (a *itemAgent) Insert(ctx context.Context, m []*v1model.Item )  ([]string, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "insert")
	defer span.End()
	a.logger.For(ctx).Info("Inserting into item")


	queryOpts := options.InsertMany().SetOrdered(false)
	res, err := a.collection.InsertMany(ctx, m, queryOpts)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting into item", zap.String("cause", errors.Cause(err).Error()))
		return nil, err
	}

	var insertions = []string{}
	for _, iValue := range res.InsertedIDs {
		insertions = append(insertions, iValue.(string))
	}

	return insertions, nil
}


func (a *itemAgent) Upsert(ctx context.Context, m []*v1model.Item ) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "upsert")
	defer span.End()
	a.logger.For(ctx).Info("Upserting into item")
	// https://www.mongodb.com/docs/drivers/go/current/crud/query/retrieve/#std-label-golang-retrieve

	for _, om := range m {
		filter := map[string] []map[string] string {
			"$and": []map[string] string{
				map[string] string{"_id": om.Id},
				map[string] string{"userId": om.UserId},
			},
		}
		opts := options.FindOneAndReplace().SetUpsert(true).SetReturnDocument(options.After)
		var replacedDocument bson.M
		err := a.collection.
			FindOneAndReplace(ctx, filter, om, opts).
			Decode(&replacedDocument)
		if err != nil {
			a.logger.For(ctx).Error("Error occurred in repository while replacing item", zap.String("cause", errors.Cause(err).Error()))
			return err
		}
	}
	return nil
}
