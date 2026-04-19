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

type Tag interface {
	ReadTag(ctx context.Context, m *[]bson.M, f *model.RepoReadCountFilter) error
	UpdateTag(ctx context.Context, m []*model.RepoUpdate) error
}

type tagAgent struct {
	logger     *logging.Factory
	db         *mongo.Database
	client     *mongo.Client
	collection *mongo.Collection
}

func (a *tagAgent) ReadTag(ctx context.Context, m *[]bson.M, f *model.RepoReadCountFilter) error {
	ctx, span := otel.Tracer("tag-repository").Start(ctx, "Read")
	defer span.End()
	a.logger.For(ctx).Info("Reading from tag")
	skip := f.Pagination.PageNumber * f.Pagination.PageSize
	preFilter := bson.A{
		bson.M{"userId": bson.M{"$regex": f.UserId, "$options": "i"}},
	}
	postFilter := bson.A{}

	if len(f.Tags) > 0 {
		postFilter = append(postFilter, bson.M{"name": bson.M{"$regex": f.Tags[0], "$options": "i"}})
	}
	if f.Search != "" {
		sh := bson.M{"$or": bson.A{
			bson.M{"name": bson.M{"$regex": f.Search, "$options": "i"}},
		}}
		postFilter = append(postFilter, sh)
	}

	pipeline := mongo.Pipeline{
		{
			{"$match", bson.D{
				{"$and", preFilter},
			}},
		},
		{
			{"$lookup", bson.D{
				{"from", "items"},
				{"let", bson.D{{"rootId", "$_id"}}},
				{"pipeline", bson.A{
					bson.D{{"$match", bson.D{
						{"$expr", bson.D{
							{"$in", bson.A{
								"$$rootId",
								"$tags",
							}},
						}},
					}}},
				}},
				{"as", "joined"},
			}},
		},
		{
			{"$addFields", bson.D{
				{"count", bson.D{{"$size", "$joined"}}},
			}},
		},
		{{"$unset", "joined"}},
		{
			{"$sort", bson.D{{"name", 1}}},
		},
		{
			{"$facet", bson.D{
				{"results", bson.A{
					bson.D{{"$skip", skip}},
					bson.D{{"$limit", f.Pagination.PageSize}},
				}},
				{"totalCount", bson.A{
					bson.D{{"$count", "count"}},
				}},
			}},
		},
	}

	// pipeline := mongo.Pipeline{
	// 	{{"$unwind", "$tags"}},
	// 	{{"$match", bson.D{{"$and", ablock}}}},
	// 	{{"$group", bson.D{
	// 		{"_id", "$tags"},
	// 		{"count", bson.D{{"$sum", 1}}},
	// 	}}},
	// 	{{"$sort", bson.D{{"_id", 1}}}},
	// 	{{"$facet", bson.D{
	// 		{"tags", bson.A{
	// 			bson.D{{"$skip", skip}},
	// 			bson.D{{"$limit", f.Pagination.PageSize}},
	// 		}},
	// 		{"totalDistinctTags", bson.A{
	// 			bson.D{{"$count", "total"}},
	// 		}},
	// 	}}},
	// 	{{"$project", bson.D{
	// 		{"tags", 1},
	// 		{"totalDistinctTags", bson.D{
	// 			{"$arrayElemAt", bson.A{"$totalDistinctTags.total", 0}},
	// 		}},
	// 	}}},
	// }

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

func (a *tagAgent) UpdateTag(ctx context.Context, m []*model.RepoUpdate) error {
	ctx, span := otel.Tracer("tag-repository").Start(ctx, "update many")
	defer span.End()
	a.logger.For(ctx).Info("Updating many in tag")
	// https://www.mongodb.com/docs/drivers/go/current/crud/query/retrieve/#std-label-golang-retrieve

	opts := options.BulkWrite().SetOrdered(false)
	models := []mongo.WriteModel{}
	for _, om := range m {
		models = append(
			models,
			mongo.NewUpdateOneModel().
				SetFilter(om.Filter).
				SetUpdate(om.Update).
				SetUpsert(true),
		)
	}
	_, err := a.collection.BulkWrite(ctx, models, opts)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating tag", zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	a.logger.For(ctx).Info("Finished updating many in tag")
	return nil
}
