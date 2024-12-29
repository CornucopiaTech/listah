package repository

import (
	"context"
	"fmt"
	"cornucopia/listah/internal/pkg/logging"
	"cornucopia/listah/internal/pkg/model"

	"github.com/pkg/errors"
	// "go.mongodb.org/mongo-driver/bson"
	// "go.mongodb.org/mongo-driver/bson/primitive"
	// "go.mongodb.org/mongo-driver/v2/mongo"
	// "go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

type EmptyInterface []interface{}

type ItemRepository interface {
	ReadOne(ctx context.Context, repoModel *model.Item, readFilter map[string]string) error
	ReadMany(ctx context.Context, repoModel *model.Items, readFilter map[string][]string) error

	InsertOne(ctx context.Context, repoModel *model.Item) (string, error)
	InsertMany(ctx context.Context, repoModel *model.Items) (*mongo.InsertManyResult, error)

	// InsertMany(ctx context.Context, repoModel *model.ItemsWrite) error
	// UpdateOne(ctx context.Context, repoModel *model.ItemWrite) error
	// UpdateMany(ctx context.Context, repoModel *model.ItemsWrite) error
	// DeleteOne(ctx context.Context, repoModel *model.ItemWrite, col string) error
	// SoftDeleteOne(ctx context.Context, repoModel *model.ItemWrite) error
	// SoftDeleteMany(ctx context.Context, repoModel *model.ItemsWrite) error
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

func (a *itemRepositoryAgent) ReadMany(ctx context.Context, repoModel *model.Items, readFilter map[string][]string) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "Read many")
	defer span.End()
	a.logger.For(ctx).Info("Reading many from item by filter", zap.Object("filter", repoModel))

	err := a.collection.FindOne(ctx, readFilter).Decode(repoModel)
	if errors.Is(err, mongo.ErrNoDocuments) {
		a.logger.For(ctx).Error("Document could not be found for given filter", zap.Object("filter", repoModel), zap.String("cause", errors.Cause(err).Error()))
		return err
	} else if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while reading many from item using filter", zap.Object("filter", repoModel), zap.String("cause", errors.Cause(err).Error()))
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
		a.logger.For(ctx).Error("Unexpected type retured after inserting one into item", zap.String("cause", errors.Cause(err).Error()))
		return "", nil
	}

	return insertedId, nil
}

func (a *itemRepositoryAgent) InsertMany(ctx context.Context, repoModel *model.Items)  (*mongo.InsertManyResult, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "insert many")
	defer span.End()
	a.logger.For(ctx).Info("Inserting many into item")

	queryOpts := options.InsertMany().SetOrdered(false)

	// var j []interface{} = &i
	// var recastModel []interface{} = *repoModel
	recastModel := EmptyInterface(repoModel)
	res, err := a.collection.InsertMany(ctx, recastModel, queryOpts)


	// res, err := a.collection.InsertMany(ctx, repoModel, queryOpts)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting many into item", zap.String("cause", errors.Cause(err).Error()))
		return nil, err
	}

	fmt.Println(res)

	return res, nil
}

// func (a *itemRepositoryAgent) InsertMany(ctx context.Context, repoModel *model.ItemsWrite) error {
// 	ctx, span := otel.Tracer("item-repository").Start(ctx, "insert-many")
// 	defer span.End()
// 	a.logger.For(ctx).Info("Inserting many into item")

// 	_, err := a.db.NewInsert().Model(repoModel).Exec(ctx)
// 	if err != nil {
// 		a.logger.For(ctx).Error("Error occurred in repository while inserting many into item", zap.String("cause", errors.Cause(err).Error()))
// 		return err
// 	}

// 	return nil
// }

// func (a *itemRepositoryAgent) UpdateOne(ctx context.Context, repoModel *model.ItemWrite) error {
// 	ctx, span := otel.Tracer("item-repository").Start(ctx, "update-one")
// 	defer span.End()
// 	a.logger.For(ctx).Info("Updating item")

// 	_, err := a.db.NewUpdate().Model(repoModel).WherePK().Exec(ctx)
// 	if err != nil {
// 		a.logger.For(ctx).Error("Error occurred in repository while updating one item", zap.String("cause", errors.Cause(err).Error()))
// 		return err
// 	}

// 	return nil
// }
// func (a *itemRepositoryAgent) UpdateMany(ctx context.Context, repoModel *model.ItemsWrite) error {
// 	ctx, span := otel.Tracer("item-repository").Start(ctx, "update-many")
// 	defer span.End()
// 	a.logger.For(ctx).Info("Updating many item")

// 	values := a.db.NewValues(repoModel)
// 	_, err := a.db.NewUpdate().
// 		With("_data", values).
// 		Model((*model.ItemWrite)(nil)).
// 		TableExpr("_data").
// 		Set("name = _data.name").
// 		Set("description = _data.description").
// 		Set("quantity = _data.quantity").
// 		Set("note = _data.note").
// 		Set("category_id = _data.category_id::UUID").
// 		Set("store_id = _data.store_id::UUID").
// 		Set("reactivate_at = _data.reactivate_at::UUID").
// 		Set("audit = _data.audit").
// 		Where("i.id::VARCHAR = _data.id").
// 		Exec(ctx)

// 	if err != nil {
// 		a.logger.For(ctx).Error("Error occurred in repository while updating many item", zap.String("cause", errors.Cause(err).Error()))
// 		return err
// 	}

// 	return nil
// }

// func (a *itemRepositoryAgent) SoftDeleteOne(ctx context.Context, repoModel *model.ItemWrite) error {
// 	ctx, span := otel.Tracer("item-repository").Start(ctx, "soft-delete-one")
// 	defer span.End()
// 	a.logger.For(ctx).Info("soft-deleting one item")

// 	_, err := a.db.NewUpdate().Model(repoModel).WherePK().Exec(ctx)
// 	if err != nil {
// 		a.logger.For(ctx).Error("Error occurred in repository while soft-deleting item", zap.String("cause", errors.Cause(err).Error()))
// 		return err
// 	}
// 	return nil
// }

// func (a *itemRepositoryAgent) SoftDeleteMany(ctx context.Context, repoModel *model.ItemsWrite) error {
// 	ctx, span := otel.Tracer("item-repository").Start(ctx, "soft-delete-many")
// 	defer span.End()
// 	a.logger.For(ctx).Info("Soft-deleting many item")

// 	values := a.db.NewValues(repoModel)
// 	_, err := a.db.NewUpdate().
// 		With("_data", values).
// 		Model((*model.ItemWrite)(nil)).
// 		TableExpr("_data").
// 		Set("name = _data.name").
// 		Set("description = _data.description").
// 		Set("quantity = _data.quantity").
// 		Set("note = _data.note").
// 		Set("category_id = _data.category_id::UUID").
// 		Set("store_id = _data.store_id::UUID").
// 		Set("reactivate_at = _data.reactivate_at::UUID").
// 		Set("audit = _data.audit").
// 		Where("i.id::VARCHAR = _data.id").
// 		Exec(ctx)

// 	if err != nil {
// 		a.logger.For(ctx).Error("Error occurred in repository while soft-deleting many item", zap.String("cause", errors.Cause(err).Error()))
// 		return err
// 	}

// 	return nil
// }

// func (a *itemRepositoryAgent) DeleteOne(ctx context.Context, repoModel *model.ItemWrite, col string) error {
// 	ctx, span := otel.Tracer("item-repository").Start(ctx, "delete-one")
// 	defer span.End()
// 	a.logger.For(ctx).Info("Hard deleting item")

// 	_, err := a.db.NewDelete().Model(repoModel).Where("? = ?", bun.Ident(col), repoModel.Id).Exec(ctx)
// 	if err != nil {
// 		a.logger.For(ctx).Error("Error occurred in repository while deleting item", zap.String("cause", errors.Cause(err).Error()))
// 		return err
// 	}
// 	return nil
// }
