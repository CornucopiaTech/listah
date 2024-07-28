package repository

import (
	"context"
	"cornucopia/listah/internal/pkg/logging"
	"cornucopia/listah/internal/pkg/model"

	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

type StoreRepository interface {
	SelectOne(ctx context.Context, id string) (*model.Store, error)
	SelectMany(ctx context.Context, id *model.Categories) (*model.Categories, error)
	Select(ctx context.Context, where_map map[string]string) (*model.Store, error)
	InsertOne(ctx context.Context, store *model.Store) error
	InsertMany(ctx context.Context, store *model.Categories) error
	UpdateOne(ctx context.Context, store *model.Store) error
	DeleteOne(ctx context.Context, id string) error
	SoftDeleteOne(ctx context.Context, store *model.Store) error

	// DeleteOne()
	// SelectMany()
	// InsertMany()
	// CreateMany()
	// UpdateMany()
	// DeleteMany()
}

type storeRepositoryAgent struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *storeRepositoryAgent) SelectOne(ctx context.Context, id string) (*model.Store, error) {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "SelectOne")
	defer span.End()

	a.logger.For(ctx).Info("Selecting store", zap.String("store", id))

	store := new(model.Store)
	err := a.db.NewSelect().Model(store).Where("id = ?", id).Scan(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while selecting store", zap.String("store", id), zap.String("cause", errors.Cause(err).Error()))
		return nil, err
	}
	return store, nil
}
func (a *storeRepositoryAgent) SelectMany(ctx context.Context, store *model.Categories) (*model.Categories, error) {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "select-many")
	defer span.End()

	a.logger.For(ctx).Info("Selecting many from store")

	err := a.db.NewSelect().Model(store).WherePK("id").Scan(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while selecting many from store", zap.String("cause", errors.Cause(err).Error()))
		return nil, err
	}
	return store, nil
}

func (a *storeRepositoryAgent) Select(ctx context.Context, where_map map[string]string) (*model.Store, error) {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "SelectOne")
	defer span.End()

	a.logger.For(ctx).Info("Selecting store with where clause")

	store := new(model.Store)
	query := addWhere(a.db.NewSelect().Model(store).QueryBuilder(), where_map)
	selectQuery := query.Unwrap().(*bun.SelectQuery)

	err := selectQuery.Scan(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while selecting store with where clause", zap.String("cause", errors.Cause(err).Error()))
		return nil, err
	}
	return store, nil
}

func (a *storeRepositoryAgent) InsertOne(ctx context.Context, store *model.Store) error {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "InsertOne")
	defer span.End()

	a.logger.For(ctx).Info("Inserting store", zap.String("store", store.Id))
	_, err := a.db.NewInsert().Model(store).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting store", zap.String("store", store.Id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *storeRepositoryAgent) InsertMany(ctx context.Context, store *model.Categories) error {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "insert-many")
	defer span.End()

	a.logger.For(ctx).Info("Inserting many into store")
	_, err := a.db.NewInsert().Model(store).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting many into store", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *storeRepositoryAgent) UpdateOne(ctx context.Context, store *model.Store) error {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "UpdateOne")
	defer span.End()

	a.logger.For(ctx).Info("Updating store", zap.String("store", store.Id))
	_, err := a.db.NewUpdate().Model(store).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating store", zap.String("store", store.Id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *storeRepositoryAgent) SoftDeleteOne(ctx context.Context, store *model.Store) error {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "SoftDeleteOne")
	defer span.End()

	a.logger.For(ctx).Info("soft-deleting store", zap.String("store", store.Id))
	_, err := a.db.NewUpdate().Model(store).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while soft-deleting store", zap.String("store", store.Id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil

}

func (a *storeRepositoryAgent) DeleteOne(ctx context.Context, id string) error {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "DeleteOne")
	defer span.End()

	a.logger.For(ctx).Info("Selecting store", zap.String("store", id))

	store := new(model.Store)
	_, err := a.db.NewDelete().Model(store).Where("id = ?", id).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while deleting store", zap.String("store", id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}
