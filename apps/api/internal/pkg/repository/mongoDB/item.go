package mongoDB

import (
	"context"
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
	Update(ctx context.Context, m []*v1model.ItemUpdate) error
	Replace(ctx context.Context, m []*v1model.ItemReplace) error
}

type itemAgent struct {
	logger     *logging.Factory
	client     *mongo.Client
	collection *mongo.Collection
}

func (a *itemAgent) Read(ctx context.Context, m *[]*v1model.Item, readFilter any) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "Read")
	defer span.End()
	a.logger.For(ctx).Info("Reading from item")

	sort := bson.D{{Key: "title", Value: 1}}
	opts := options.Find().SetSort(sort)

	cursor, err := a.collection.Find(ctx, readFilter, opts)
	if errors.Is(err, mongo.ErrNoDocuments) {
		a.logger.For(ctx).Error("Document could not be found", zap.String("cause", errors.Cause(err).Error()))
		return nil
	} else if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while reading from item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	if err := cursor.All(ctx, m); err != nil {
		a.logger.For(ctx).Error("Error occurred while marshalling find results into model", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *itemAgent) Insert(ctx context.Context, m []*v1model.Item) ([]string, error) {
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

func (a *itemAgent) Update(ctx context.Context, m []*v1model.ItemUpdate) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "update")
	defer span.End()
	a.logger.For(ctx).Info("Updating into item")
	// https://www.mongodb.com/docs/drivers/go/current/crud/query/retrieve/#std-label-golang-retrieve

	opts := options.FindOneAndUpdate().SetUpsert(true).SetReturnDocument(options.After)
	for _, om := range m {
		var replacedDocument bson.M
		err := a.collection.
			FindOneAndUpdate(ctx, om.Filter, om.Update, opts).
			Decode(&replacedDocument)
		if err != nil {
			a.logger.For(ctx).Error("Error occurred in repository while updating item", zap.String("cause", errors.Cause(err).Error()))
			return err
		}
	}
	return nil
}

func (a *itemAgent) Replace(ctx context.Context, m []*v1model.ItemReplace) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "replace")
	defer span.End()
	a.logger.For(ctx).Info("Replacing item")
	// https://www.mongodb.com/docs/drivers/go/current/crud/query/retrieve/#std-label-golang-retrieve

	opts := options.FindOneAndReplace().SetUpsert(true) //.SetReturnDocument(options.After)
	for _, om := range m {
		var replacedDocument bson.M
		err := a.collection.
			FindOneAndReplace(ctx, om.Filter, om.Replace, opts).
			Decode(&replacedDocument)
		if err != nil {
			a.logger.For(ctx).Error("Error occurred in repository while replacing item", zap.String("cause", errors.Cause(err).Error()))
			return err
		}
	}
	return nil
}
