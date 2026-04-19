package mongoDB

import (
	"context"
	"cornucopia/listah/internal/pkg/logging"
	model "cornucopia/listah/internal/pkg/model/v1"
	"time"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

type Filter interface {
	ReadFilter(ctx context.Context, m *[]bson.M, f *model.RepoReadCountFilter) error
	UpdateFilter(ctx context.Context, m []*model.Filter) error
}

type filterAgent struct {
	logger     *logging.Factory
	db         *mongo.Database
	client     *mongo.Client
	collection *mongo.Collection
}

func (a *filterAgent) ReadFilter(ctx context.Context, m *[]bson.M, f *model.RepoReadCountFilter) error {
	ctx, span := otel.Tracer("filter-repository").Start(ctx, "Read")
	defer span.End()
	a.logger.For(ctx).Info("Reading from filter")

	skip := f.Pagination.PageNumber * f.Pagination.PageSize
	preFilter := bson.A{
		bson.M{"userId": bson.M{"$regex": f.UserId, "$options": "i"}},
	}
	postFilter := bson.A{}

	if len(f.Tags) > 0 {
		postFilter = append(postFilter, bson.M{"tags": bson.M{"$in": f.Tags}})
	}
	if f.Search != "" {
		sh := bson.M{"$or": bson.A{
			bson.M{"name": bson.M{"$regex": f.Search, "$options": "i"}},
			bson.M{"tags": bson.M{"$regex": f.Search, "$options": "i"}},
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
				{"localField", "userId"},
				{"foreignField", "userId"},
				{"as", "joined"},
			}},
		},
		{
			{"$addFields", bson.D{
				{"joined", bson.D{
					{"$filter", bson.D{
						{"input", "$joined"},
						{"as", "it"},
						{"cond", bson.D{
							{"$gt", bson.A{
								bson.D{{"$size",
									bson.D{{"$setIntersection", bson.A{"$$it.tags", "$tags"}}},
								}},
								0,
							}},
						}},
					}},
				}},
			}},
		},
		{
			{"$addFields", bson.D{
				{"count", bson.D{{"$size", "$joined"}}},
			}},
		},
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

	cursor, err := a.collection.Aggregate(ctx, pipeline)
	if errors.Is(err, mongo.ErrNoDocuments) {
		a.logger.For(ctx).Error("Document could not be found", zap.String("cause", errors.Cause(err).Error()))
		return nil
	} else if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while reading from filter", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	if err := cursor.All(ctx, m); err != nil {
		a.logger.For(ctx).Error("Error occurred while marshalling find results into model", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *filterAgent) UpdateFilter(ctx context.Context, m []*model.Filter) error {
	ctx, span := otel.Tracer("filter-repository").Start(ctx, "update many")
	defer span.End()
	a.logger.For(ctx).Info("Updating many in filter")
	// https://www.mongodb.com/docs/drivers/go/current/crud/query/retrieve/#std-label-golang-retrieve

	ta := &tagAgent{
		client:     a.client,
		db:         a.db,
		logger:     a.logger,
		collection: a.db.Collection("tags"),
	}
	cursor, err := ta.collection.Find(ctx, bson.M{})
	if errors.Is(err, mongo.ErrNoDocuments) {
		a.logger.For(ctx).Error("Document could not be found", zap.String("cause", errors.Cause(err).Error()))
		return nil
	} else if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while reading from item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	tags := []bson.M{}
	if err := cursor.All(ctx, &tags); err != nil {
		a.logger.For(ctx).Error("Error occurred while marshalling find results into model", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	// fmt.Printf("\n\ntags[0] %+v \n\n", tags[0])
	tagMap := make(map[string]map[string]interface{}) // userId: {name: id}}
	for _, t := range tags {
		if _, ok := tagMap[t["userId"].(string)]; !ok {
			tagMap[t["userId"].(string)] = make(map[string]interface{})
		}
		k1 := t["userId"].(string)
		k2 := t["name"].(string)
		v := t["_id"].(bson.ObjectID) //.Hex()
		tagMap[k1][k2] = v
	}

	opts := options.BulkWrite().SetOrdered(false)
	models := []mongo.WriteModel{}
	for _, om := range m {
		tis := make([]interface{}, 0, len(om.Tags))
		for _, name := range om.Tags {
			if id, ok := tagMap[om.UserId][name]; ok {
				tis = append(tis, id)
			}
		}

		models = append(
			models,
			mongo.NewUpdateOneModel().
				SetFilter(bson.M{"name": om.Name, "userId": om.UserId}).
				SetUpdate(bson.M{
					"$set": bson.M{
						"tags":      tis,
						"updatedAt": time.Now().UTC(),
						"updatedBy": "api",
					},
				}).SetUpsert(true),
		)
	}
	_, err = a.collection.BulkWrite(ctx, models, opts)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating filter", zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	a.logger.For(ctx).Info("Successfully updated filter")
	return nil
}
