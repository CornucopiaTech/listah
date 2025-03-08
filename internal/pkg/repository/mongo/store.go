package mongo

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
	SelectOne(ctx context.Context, repoModel *model.StoreRead, col string) error
	SelectMany(ctx context.Context, repoModel *model.StoresRead, col string) error
	InsertOne(ctx context.Context, repoModel *model.StoreWrite) error
	InsertMany(ctx context.Context, repoModel *model.StoresWrite) error
	UpdateOne(ctx context.Context, repoModel *model.StoreWrite) error
	UpdateMany(ctx context.Context, repoModel *model.StoresWrite) error
	DeleteOne(ctx context.Context, repoModel *model.StoreWrite, col string) error
	SoftDeleteOne(ctx context.Context, repoModel *model.StoreWrite) error
	SoftDeleteMany(ctx context.Context, repoModel *model.StoresWrite) error
}

type storeRepositoryAgent struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *storeRepositoryAgent) SelectOne(ctx context.Context, repoModel *model.StoreRead, col string) error {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "Select one")
	defer span.End()
	a.logger.For(ctx).Info("Selecting one from store by column", zap.String("column", col))

	if err := a.db.NewSelect().
		Model(repoModel).
		ColumnExpr("s.*").
		ColumnExpr("c.name AS category_name").
		Join("JOIN app.categories AS c ON c.id = s.category_id").
		WherePK(col).Scan(ctx); err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while selecting many from store by column", zap.String("column", col), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}

func (a *storeRepositoryAgent) SelectMany(ctx context.Context, repoModel *model.StoresRead, col string) error {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "select many")
	defer span.End()

	a.logger.For(ctx).Info("Selecting many from store by column", zap.String("column", col))

	if err := a.db.NewSelect().
		Model(repoModel).
		ColumnExpr("s.*").
		ColumnExpr("c.name AS category_name").
		Join("JOIN app.categories AS c ON c.id = s.category_id").
		WherePK(col).Scan(ctx); err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while selecting many from store by column", zap.String("column", col), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}

func (a *storeRepositoryAgent) InsertOne(ctx context.Context, repoModel *model.StoreWrite) error {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "insert one")
	defer span.End()
	a.logger.For(ctx).Info("Inserting one into store")

	_, err := a.db.NewInsert().Model(repoModel).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting one store", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}
func (a *storeRepositoryAgent) InsertMany(ctx context.Context, repoModel *model.StoresWrite) error {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "insert-many")
	defer span.End()
	a.logger.For(ctx).Info("Inserting many into store")

	_, err := a.db.NewInsert().Model(repoModel).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting many into store", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *storeRepositoryAgent) UpdateOne(ctx context.Context, repoModel *model.StoreWrite) error {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "update-one")
	defer span.End()
	a.logger.For(ctx).Info("Updating store")

	_, err := a.db.NewUpdate().Model(repoModel).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating one store", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}
func (a *storeRepositoryAgent) UpdateMany(ctx context.Context, repoModel *model.StoresWrite) error {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "update-many")
	defer span.End()
	a.logger.For(ctx).Info("Updating many store")

	values := a.db.NewValues(repoModel)
	_, err := a.db.NewUpdate().
		With("_data", values).
		Model((*model.StoreWrite)(nil)).
		TableExpr("_data").
		Set("name = _data.name").
		Set("description = _data.description").
		Set("note = _data.note").
		Set("category_id = _data.category_id::UUID").
		Set("audit = _data.audit").
		Where("s.id::VARCHAR = _data.id").
		Exec(ctx)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating many store", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *storeRepositoryAgent) SoftDeleteOne(ctx context.Context, repoModel *model.StoreWrite) error {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "soft-delete-one")
	defer span.End()
	a.logger.For(ctx).Info("soft-deleting one store")

	_, err := a.db.NewUpdate().Model(repoModel).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while soft-deleting store", zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}

func (a *storeRepositoryAgent) SoftDeleteMany(ctx context.Context, repoModel *model.StoresWrite) error {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "soft-delete-many")
	defer span.End()
	a.logger.For(ctx).Info("Soft-deleting many store")

	values := a.db.NewValues(repoModel)
	_, err := a.db.NewUpdate().
		With("_data", values).
		Model((*model.StoreWrite)(nil)).
		TableExpr("_data").
		Set("name = _data.name").
		Set("description = _data.description").
		Set("note = _data.note").
		Set("category_id = _data.category_id::UUID").
		Set("audit = _data.audit").
		Where("s.id::VARCHAR = _data.id").
		Exec(ctx)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while soft-deleting many store", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *storeRepositoryAgent) DeleteOne(ctx context.Context, repoModel *model.StoreWrite, col string) error {
	ctx, span := otel.Tracer("store-repository").Start(ctx, "delete-one")
	defer span.End()
	a.logger.For(ctx).Info("Hard deleting store")

	_, err := a.db.NewDelete().Model(repoModel).Where("? = ?", bun.Ident(col), repoModel.Id).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while deleting store", zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}
