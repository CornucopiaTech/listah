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

type Filter interface {
	Read(ctx context.Context, m *[]bson.M, f *model.RepoReadCountFilter) error
	Insert(ctx context.Context, m []*model.Filter) ([]string, error)
	Update(ctx context.Context, m []*model.RepoUpdate) error
	Replace(ctx context.Context, m []*model.RepoReplace) error
	UpdateMany(ctx context.Context, m []*model.RepoUpdate) error
}

type filterAgent struct {
	logger     *logging.Factory
	client     *mongo.Client
	collection *mongo.Collection
}

func (a *filterAgent) Read(ctx context.Context, m *[]bson.M, f *model.RepoReadCountFilter) error {
	ctx, span := otel.Tracer("filter-repository").Start(ctx, "Read")
	defer span.End()
	a.logger.For(ctx).Info("Reading from filter")

	skip := f.Pagination.PageNumber * f.Pagination.PageSize

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
		{
			// Apply filters on userId, name, and tags
			{"$match", bson.D{{"$and", ablock}}},
		},
		{
			// Start from collection A (already implied by Aggregate call)
			{"$lookup", bson.D{
				{"from", "items"},
				{"let", bson.D{
					{"uid", "$userId"},    // string field
					{"itemTags", "$tags"}, // array field
				}},
				{"pipeline", bson.A{
					bson.D{{"$match", bson.D{
						{"$expr", bson.D{
							{"$and", bson.A{
								// Condition 1: string-to-string match
								bson.D{{"$eq", bson.A{"$userId", "$$uid"}}},

								// Condition 2: array intersection is non-empty
								bson.D{{"$gt", bson.A{
									bson.D{{"$size",
										bson.D{{"$setIntersection", bson.A{"$tags", "$$itemTags"}}},
									}},
									0,
								}}},
							}},
						}},
					}}},
				}},
				{"as", "joined"},
			}},
		},
		{
			// Define results shape and add count of matching items
			{"$project", bson.M{
				"_id":   1,
				"name":  1,
				"tags":  1,
				"count": bson.M{"$size": "$joined"},
			}},
		},
		{
			// Sort by name
			{"$sort", bson.D{{"name", 1}}},
		},
		{
			// Return total count of documents and paginated results
			{
				"$facet", bson.D{
					{"results", bson.A{
						bson.D{{"$skip", skip}},
						bson.D{{"$limit", f.Pagination.PageSize}},
					}},
					{"totalCount", bson.A{
						bson.D{{"$count", "count"}},
					}},
				},
			},
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

func (a *filterAgent) ReadTest(ctx context.Context, m *[]bson.M, f *model.RepoReadCountFilter) error {
	ctx, span := otel.Tracer("filter-repository").Start(ctx, "Read")
	defer span.End()
	a.logger.For(ctx).Info("Reading from filter")

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
		{{
			"$lookup", bson.D{
				{"from", "items"},
				{"let", bson.M{"itemUserId": "$userId"}},
				{"pipeline", bson.A{
					bson.M{"$match": bson.M{
						"$expr": bson.M{"$eq": bson.A{"$userId", "$$itemUserId"}},
					}},
					bson.D{{"$unwind", "$tags"}},
					bson.M{"$sort": bson.M{"name": 1}},
					bson.D{{"$group", bson.D{
						{"_id", "$tags"},
						{"count", bson.D{{"$sum", 1}}},
					}}},
					bson.M{
						"$facet": bson.M{
							"results": bson.A{
								bson.D{{"$skip", skip}},
								bson.D{{"$limit", f.Pagination.PageSize}},
							},
							"totalCount": bson.A{
								bson.D{{"$count", "count"}},
							},
						}},
					// bson.M{"$project": bson.M{
					// 	"_id":  0,
					// 	"name": 1,
					// 	"city": 1,
					// }},
				}},
				{"as", "results"},
			}}},
	}

	// pipeline = mongo.Pipeline{
	// 	{{"$match", bson.D{{"$and", ablock}}}},
	// 	{{"$sort", bson.D{{"name", 1}}}},
	// 	{{"$facet", bson.D{
	// 		{"results", bson.A{
	// 			bson.D{{"$skip", skip}},
	// 			bson.D{{"$limit", f.Pagination.PageSize}},
	// 		}},
	// 		{"totalCount", bson.A{
	// 			bson.D{{"$count", "count"}},
	// 		}},
	// 	}}},
	// }

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

func (a *filterAgent) Insert(ctx context.Context, m []*model.Filter) ([]string, error) {
	ctx, span := otel.Tracer("filter-repository").Start(ctx, "insert")
	defer span.End()
	a.logger.For(ctx).Info("Inserting into filter")

	queryOpts := options.InsertMany().SetOrdered(false)
	res, err := a.collection.InsertMany(ctx, m, queryOpts)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting into filter", zap.String("cause", errors.Cause(err).Error()))
		return nil, err
	}

	var insertions = []string{}
	for _, iValue := range res.InsertedIDs {
		insertions = append(insertions, iValue.(string))
	}

	return insertions, nil
}

func (a *filterAgent) Update(ctx context.Context, m []*model.RepoUpdate) error {
	ctx, span := otel.Tracer("filter-repository").Start(ctx, "update")
	defer span.End()
	a.logger.For(ctx).Info("Updating into filter")
	// https://www.mongodb.com/docs/drivers/go/current/crud/query/retrieve/#std-label-golang-retrieve

	opts := options.FindOneAndUpdate().SetUpsert(true).SetReturnDocument(options.After)
	for _, om := range m {
		var replacedDocument bson.M
		err := a.collection.
			FindOneAndUpdate(ctx, om.Filter, om.Update, opts).
			Decode(&replacedDocument)
		if err != nil {
			a.logger.For(ctx).Error("Error occurred in repository while updating filter", zap.String("cause", errors.Cause(err).Error()))
			return err
		}
	}
	return nil
}

func (a *filterAgent) UpdateMany(ctx context.Context, m []*model.RepoUpdate) error {
	ctx, span := otel.Tracer("filter-repository").Start(ctx, "update many")
	defer span.End()
	a.logger.For(ctx).Info("Updating many in filter")
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
		// 	a.logger.For(ctx).Error("Error occurred in repository while updating filter", zap.String("cause", errors.Cause(err).Error()))
		// 	return err
		// }
	}
	_, err := a.collection.BulkWrite(ctx, models, opts)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating filter", zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}

func (a *filterAgent) Replace(ctx context.Context, m []*model.RepoReplace) error {
	ctx, span := otel.Tracer("filter-repository").Start(ctx, "replace")
	defer span.End()
	a.logger.For(ctx).Info("Replacing filter")
	// https://www.mongodb.com/docs/drivers/go/current/crud/query/retrieve/#std-label-golang-retrieve

	opts := options.FindOneAndReplace().SetUpsert(true) //.SetReturnDocument(options.After)
	for _, om := range m {
		var replacedDocument bson.M
		err := a.collection.
			FindOneAndReplace(ctx, om.Filter, om.Replace, opts).
			Decode(&replacedDocument)
		if err != nil {
			a.logger.For(ctx).Error("Error occurred in repository while replacing filter", zap.String("cause", errors.Cause(err).Error()))
			return err
		}
	}
	return nil
}
