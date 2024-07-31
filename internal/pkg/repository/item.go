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

type ItemRepository interface {
	SelectOne(ctx context.Context, repoModel *model.ItemRead, col string) error
	SelectMany(ctx context.Context, repoModel *model.ItemsRead, col string) error
	InsertOne(ctx context.Context, repoModel *model.ItemWrite) error
	InsertMany(ctx context.Context, repoModel *model.ItemsWrite) error
	UpdateOne(ctx context.Context, repoModel *model.ItemWrite) error
	UpdateMany(ctx context.Context, repoModel *model.ItemsWrite) error
	DeleteOne(ctx context.Context, repoModel *model.ItemWrite, col string) error
	SoftDeleteOne(ctx context.Context, repoModel *model.ItemWrite) error
	SoftDeleteMany(ctx context.Context, repoModel *model.ItemsWrite) error
}

type itemRepositoryAgent struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *itemRepositoryAgent) SelectOne(ctx context.Context, repoModel *model.ItemRead, col string) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "Select one")
	defer span.End()
	a.logger.For(ctx).Info("Selecting one from item by column", zap.String("column", col))

	if err := a.db.NewSelect().
		Model(repoModel).
		ColumnExpr("i.*").
		ColumnExpr("c.name AS category_name").
		ColumnExpr("s.name AS store_name").
		Join("JOIN app.categories AS c ON c.id = i.category_id").
		Join("JOIN app.stores AS s ON s.id = i.store_id").
		WherePK(col).Scan(ctx); err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while selecting many from item by column", zap.String("column", col), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}

func (a *itemRepositoryAgent) SelectMany(ctx context.Context, repoModel *model.ItemsRead, col string) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "select many")
	defer span.End()

	a.logger.For(ctx).Info("Selecting many from item by column", zap.String("column", col))

	if err := a.db.NewSelect().
		Model(repoModel).
		ColumnExpr("i.*").
		ColumnExpr("c.name AS category_name").
		ColumnExpr("s.name AS store_name").
		Join("JOIN app.categories AS c ON c.id = i.category_id").
		Join("JOIN app.stores AS s ON s.id = i.store_id").
		WherePK(col).Scan(ctx); err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while selecting many from item by column", zap.String("column", col), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}

func (a *itemRepositoryAgent) InsertOne(ctx context.Context, repoModel *model.ItemWrite) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "insert one")
	defer span.End()
	a.logger.For(ctx).Info("Inserting one into item")

	_, err := a.db.NewInsert().Model(repoModel).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting one item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}
func (a *itemRepositoryAgent) InsertMany(ctx context.Context, repoModel *model.ItemsWrite) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "insert-many")
	defer span.End()
	a.logger.For(ctx).Info("Inserting many into item")

	_, err := a.db.NewInsert().Model(repoModel).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting many into item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *itemRepositoryAgent) UpdateOne(ctx context.Context, repoModel *model.ItemWrite) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "update-one")
	defer span.End()
	a.logger.For(ctx).Info("Updating item")

	_, err := a.db.NewUpdate().Model(repoModel).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating one item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}
func (a *itemRepositoryAgent) UpdateMany(ctx context.Context, repoModel *model.ItemsWrite) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "update-many")
	defer span.End()
	a.logger.For(ctx).Info("Updating many item")

	values := a.db.NewValues(repoModel)
	_, err := a.db.NewUpdate().
		With("_data", values).
		Model((*model.ItemWrite)(nil)).
		TableExpr("_data").
		Set("name = _data.name").
		Set("description = _data.description").
		Set("quantity = _data.quantity").
		Set("note = _data.note").
		Set("category_id = _data.category_id::UUID").
		Set("store_id = _data.store_id::UUID").
		Set("reactivate_at = _data.reactivate_at::UUID").
		Set("audit = _data.audit").
		Where("i.id::VARCHAR = _data.id").
		Exec(ctx)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating many item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *itemRepositoryAgent) SoftDeleteOne(ctx context.Context, repoModel *model.ItemWrite) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "soft-delete-one")
	defer span.End()
	a.logger.For(ctx).Info("soft-deleting one item")

	_, err := a.db.NewUpdate().Model(repoModel).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while soft-deleting item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}

func (a *itemRepositoryAgent) SoftDeleteMany(ctx context.Context, repoModel *model.ItemsWrite) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "soft-delete-many")
	defer span.End()
	a.logger.For(ctx).Info("Soft-deleting many item")

	values := a.db.NewValues(repoModel)
	_, err := a.db.NewUpdate().
		With("_data", values).
		Model((*model.ItemWrite)(nil)).
		TableExpr("_data").
		Set("name = _data.name").
		Set("description = _data.description").
		Set("quantity = _data.quantity").
		Set("note = _data.note").
		Set("category_id = _data.category_id::UUID").
		Set("store_id = _data.store_id::UUID").
		Set("reactivate_at = _data.reactivate_at::UUID").
		Set("audit = _data.audit").
		Where("i.id::VARCHAR = _data.id").
		Exec(ctx)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while soft-deleting many item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *itemRepositoryAgent) DeleteOne(ctx context.Context, repoModel *model.ItemWrite, col string) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "delete-one")
	defer span.End()
	a.logger.For(ctx).Info("Hard deleting item")

	_, err := a.db.NewDelete().Model(repoModel).Where("? = ?", bun.Ident(col), repoModel.Id).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while deleting item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}
