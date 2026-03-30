package mongoDB

import (
	"context"
	"cornucopia/listah/internal/pkg/logging"
	model "cornucopia/listah/internal/pkg/model/v1"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

type Tag interface {
	Read(ctx context.Context, m *[]bson.M, f *model.RepoReadCountFilter) error
}

type tagAgent struct {
	logger     *logging.Factory
	client     *mongo.Client
	collection *mongo.Collection
}

func (a *tagAgent) Read(ctx context.Context, m *[]bson.M, f *model.RepoReadCountFilter) error {
	ctx, span := otel.Tracer("tag-repository").Start(ctx, "Read")
	defer span.End()
	a.logger.For(ctx).Info("Reading from tag")
	skip := f.Pagination.PageNumber * f.Pagination.PageSize

	ablock := bson.A{
		bson.M{"userId": bson.M{"$regex": f.UserId, "$options": "i"}},
	}

	if f.Search != "" {
		ablock = append(ablock, bson.M{"tags": bson.M{"$regex": f.Search, "$options": "i"}})
	}

	pipeline := mongo.Pipeline{
		{{"$unwind", "$tags"}},
		{{"$match", bson.D{{"$and", ablock}}}},
		{{"$group", bson.D{
			{"_id", "$tags"},
			{"count", bson.D{{"$sum", 1}}},
		}}},
		{{"$sort", bson.D{{"_id", 1}}}},
		{{"$facet", bson.D{
			{"tags", bson.A{
				bson.D{{"$skip", skip}},
				bson.D{{"$limit", f.Pagination.PageSize}},
			}},
			{"totalDistinctTags", bson.A{
				bson.D{{"$count", "total"}},
			}},
		}}},
		{{"$project", bson.D{
			{"tags", 1},
			{"totalDistinctTags", bson.D{
				{"$arrayElemAt", bson.A{"$totalDistinctTags.total", 0}},
			}},
		}}},
	}

	cursor, err := a.collection.Aggregate(ctx, pipeline)
	if errors.Is(err, mongo.ErrNoDocuments) {
		a.logger.For(ctx).Error("Document could not be found", zap.String("cause", errors.Cause(err).Error()))
		return nil
	} else if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while reading from tag", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	if err := cursor.All(ctx, m); err != nil {
		a.logger.For(ctx).Error("Error occurred while marshalling find results into model", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}
