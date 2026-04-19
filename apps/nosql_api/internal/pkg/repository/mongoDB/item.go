package mongoDB

import (
	"context"
	"cornucopia/listah/internal/pkg/logging"
	model "cornucopia/listah/internal/pkg/model/v1"

	"time"

	// "fmt"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

type EmptyInterface []interface{}

type Item interface {
	ReadItem(ctx context.Context, m *[]bson.M, f *model.RepoReadCountFilter) error
	UpdateItem(ctx context.Context, m []*model.Item) error
}

type itemAgent struct {
	logger     *logging.Factory
	db         *mongo.Database
	client     *mongo.Client
	collection *mongo.Collection
}

func (a *itemAgent) ReadItem(ctx context.Context, m *[]bson.M, f *model.RepoReadCountFilter) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "Read")
	defer span.End()
	a.logger.For(ctx).Info("Reading from item")

	skip := (f.Pagination.PageNumber) * f.Pagination.PageSize
	preFilter := bson.A{
		bson.M{"userId": bson.M{"$regex": f.UserId, "$options": "i"}},
	}
	postFilter := bson.A{
		bson.M{"userId": bson.M{"$regex": f.UserId, "$options": "i"}},
	}

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
		{{"$match", bson.D{{"$and", preFilter}}}},
		{{"$set", bson.D{
			{"tags", bson.D{
				{"$map", bson.D{
					{"input", "$tags"},
					{"as", "t"},
					{"in", bson.D{{"$toObjectId", "$$t"}}},
				}},
			}},
		}}},
		// Join items.tags (IDs) with tags._id
		{{"$lookup", bson.D{
			{"from", "tags"},
			{"localField", "tags"},
			{"foreignField", "_id"},
			{"as", "tagDocs"},
		}}},
		// Replace tags array with tag names
		{{"$set", bson.D{
			{"tags", bson.D{
				{"$map", bson.D{
					{"input", "$tagDocs"},
					{"as", "t"},
					{"in", "$$t.name"},
				}},
			}},
		}}},
		// Remove the temporary joined array
		{{"$unset", "tagDocs"}},
		// // 4. Apply post-lookup filters
		{{"$match", bson.D{{"$and", postFilter}}}}, // <-- your filters go here

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

func (a *itemAgent) UpdateItem(ctx context.Context, m []*model.Item) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "update many")
	defer span.End()
	a.logger.For(ctx).Info("Updating many in item")
	// https://www.mongodb.com/docs/drivers/go/current/crud/query/retrieve/#std-label-golang-retrieve

	// 1. Load all tags once
	ta := &tagAgent{
		client:     a.client,
		db:         a.db,
		logger:     a.logger,
		collection: a.db.Collection("tags"),
	}

	tags := []bson.M{}
	cursor, err := ta.collection.Find(ctx, bson.M{})
	if errors.Is(err, mongo.ErrNoDocuments) {
		a.logger.For(ctx).Error("Document could not be found", zap.String("cause", errors.Cause(err).Error()))
		return nil
	} else if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while reading from item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

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
	// fmt.Printf("\n\ntagMap %+v \n\n", tagMap)
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
				SetFilter(bson.M{"_id": om.Id, "userId": om.UserId}).
				SetUpdate(bson.M{
					"$set": bson.M{
						"name":       om.Name,
						"tags":       tis,
						"props":      om.Props,
						"softDelete": om.SoftDelete,
						"updatedAt":  time.Now().UTC(),
						"updatedBy":  "api",
					},
				}).SetUpsert(true),
		)
	}
	_, err = a.collection.BulkWrite(ctx, models, opts)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}
