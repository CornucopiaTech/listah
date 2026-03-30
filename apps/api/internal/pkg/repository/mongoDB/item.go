package mongoDB

import (
	"context"
	"cornucopia/listah/internal/pkg/logging"
	model "cornucopia/listah/internal/pkg/model/v1"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

type EmptyInterface []interface{}

type Item interface {
	Read(ctx context.Context, m *[]bson.M, f *model.RepoReadCountFilter) error
	Insert(ctx context.Context, m []*model.Item) ([]string, error)
	Update(ctx context.Context, m []*model.ItemUpdate) error
	Replace(ctx context.Context, m []*model.ItemReplace) error
	UpdateMany(ctx context.Context, m []*model.ItemUpdate) error
}

type itemAgent struct {
	logger     *logging.Factory
	client     *mongo.Client
	collection *mongo.Collection
}

func (a *itemAgent) Read(ctx context.Context, m *[]bson.M, f *model.RepoReadCountFilter) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "Read")
	defer span.End()
	a.logger.For(ctx).Info("Reading from item")

	skip := (f.Pagination.PageNumber) * f.Pagination.PageSize

	ablock := bson.A{
		bson.M{"userId": bson.M{"$regex": f.UserId, "$options": "i"}},
	}

	if len(f.Tags) > 0 {
		ablock = append(ablock, bson.M{"tags": bson.M{"$in": f.Tags}})
	}
	if f.Search != "" {
		sh := bson.M{"$or": bson.A{
			bson.M{"name": bson.M{"$regex": f.Search, "$options": "i"}},
			bson.M{"tags": bson.M{"$regex": f.Search, "$options": "i"}},
		}}
		ablock = append(ablock, sh)
	}

	pipeline := mongo.Pipeline{
		{{"$match", bson.D{{"$and", ablock}}}},
		{{"$sort", bson.D{{"name", 1}}}},
		{{"$facet", bson.D{
			{"results", bson.A{
				bson.D{{"$skip", skip}},
				bson.D{{"$limit", f.Pagination.PageSize}},
			}},
			{"totalCount", bson.A{
				bson.D{{"$count", "count"}},
			}},
		}}},
	}

	cursor, err := a.collection.Aggregate(ctx, pipeline)
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

func (a *itemAgent) Insert(ctx context.Context, m []*model.Item) ([]string, error) {
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

func (a *itemAgent) Update(ctx context.Context, m []*model.ItemUpdate) error {
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

func (a *itemAgent) UpdateMany(ctx context.Context, m []*model.ItemUpdate) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "update many")
	defer span.End()
	a.logger.For(ctx).Info("Updating many in item")
	// https://www.mongodb.com/docs/drivers/go/current/crud/query/retrieve/#std-label-golang-retrieve

	opts := options.BulkWrite().SetOrdered(false)
	// opts := options.FindOneAndUpdate().SetUpsert(true).SetReturnDocument(options.After)
	models := []mongo.WriteModel{}
	for _, om := range m {
		models = append(
			models,
			mongo.NewUpdateOneModel().SetFilter(om.Filter).SetUpdate(om.Update).SetUpsert(true),
		)
		// var replacedDocument bson.M
		// err := a.collection.
		// 	FindOneAndUpdate(ctx, om.Filter, om.Update, opts).
		// 	Decode(&replacedDocument)
		// if err != nil {
		// 	a.logger.For(ctx).Error("Error occurred in repository while updating item", zap.String("cause", errors.Cause(err).Error()))
		// 	return err
		// }
	}
	_, err := a.collection.BulkWrite(ctx, models, opts)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}

func (a *itemAgent) Replace(ctx context.Context, m []*model.ItemReplace) error {
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
