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

type CategoryRepository interface {
	SelectOne(ctx context.Context, repoModel *model.Category, col string) error
	SelectMany(ctx context.Context, repoModel *model.Categories, col string) error
	InsertOne(ctx context.Context, repoModel *model.Category) error
	InsertMany(ctx context.Context, repoModel *model.Categories) error
	UpdateOne(ctx context.Context, repoModel *model.Category) error
	UpdateMany(ctx context.Context, repoModel *model.Categories) error
	DeleteOne(ctx context.Context, repoModel *model.Category, col string) error
	SoftDeleteOne(ctx context.Context, repoModel *model.Category) error
	SoftDeleteMany(ctx context.Context, repoModel *model.Categories) error
}

type categoryRepositoryAgent struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *categoryRepositoryAgent) SelectOne(ctx context.Context, repoModel *model.Category, col string) error {
	ctx, span := otel.Tracer("category-repository").Start(ctx, "Select one")
	defer span.End()
	a.logger.For(ctx).Info("Selecting one from category by column", zap.String("column", col))

	if err := a.db.NewSelect().Model(repoModel).WherePK(col).Scan(ctx); err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while selecting one from category by column", zap.String("column", col), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}
func (a *categoryRepositoryAgent) SelectMany(ctx context.Context, repoModel *model.Categories, col string) error {
	ctx, span := otel.Tracer("category-repository").Start(ctx, "select many")
	defer span.End()

	a.logger.For(ctx).Info("Selecting many from category by column", zap.String("column", col))

	if err := a.db.NewSelect().Model(repoModel).WherePK(col).Scan(ctx); err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while selecting many from category by column", zap.String("column", col), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}

func (a *categoryRepositoryAgent) InsertOne(ctx context.Context, repoModel *model.Category) error {
	ctx, span := otel.Tracer("category-repository").Start(ctx, "insert one")
	defer span.End()
	a.logger.For(ctx).Info("Inserting one into category")

	_, err := a.db.NewInsert().Model(repoModel).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting one category", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}
func (a *categoryRepositoryAgent) InsertMany(ctx context.Context, repoModel *model.Categories) error {
	ctx, span := otel.Tracer("category-repository").Start(ctx, "insert-many")
	defer span.End()
	a.logger.For(ctx).Info("Inserting many into category")

	_, err := a.db.NewInsert().Model(repoModel).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting many into category", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *categoryRepositoryAgent) UpdateOne(ctx context.Context, repoModel *model.Category) error {
	ctx, span := otel.Tracer("category-repository").Start(ctx, "update-one")
	defer span.End()
	a.logger.For(ctx).Info("Updating category")

	_, err := a.db.NewUpdate().Model(repoModel).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating one category", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}
func (a *categoryRepositoryAgent) UpdateMany(ctx context.Context, repoModel *model.Categories) error {
	ctx, span := otel.Tracer("category-repository").Start(ctx, "update-many")
	defer span.End()
	a.logger.For(ctx).Info("Updating many category")

	values := a.db.NewValues(repoModel)
	_, err := a.db.NewUpdate().
		With("_data", values).
		Model((*model.Category)(nil)).
		TableExpr("_data").
		Set("name = _data.name").
		Set("description = _data.description").
		Set("note = _data.note").
		Set("audit = _data.audit").
		Where("u.id::VARCHAR = _data.id").
		Exec(ctx)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating many category", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *categoryRepositoryAgent) SoftDeleteOne(ctx context.Context, repoModel *model.Category) error {
	ctx, span := otel.Tracer("category-repository").Start(ctx, "soft-delete-one")
	defer span.End()
	a.logger.For(ctx).Info("soft-deleting one category")

	_, err := a.db.NewUpdate().Model(repoModel).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while soft-deleting category", zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}

func (a *categoryRepositoryAgent) SoftDeleteMany(ctx context.Context, repoModel *model.Categories) error {
	ctx, span := otel.Tracer("category-repository").Start(ctx, "soft-delete-many")
	defer span.End()
	a.logger.For(ctx).Info("Soft-deleting many category")

	values := a.db.NewValues(repoModel)
	_, err := a.db.NewUpdate().
		With("_data", values).
		Model((*model.Category)(nil)).
		TableExpr("_data").
		Set("name = _data.name").
		Set("description = _data.description").
		Set("note = _data.note").
		Set("audit = _data.audit").
		Where("u.id::VARCHAR = _data.id").
		Exec(ctx)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while soft-deleting many category", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *categoryRepositoryAgent) DeleteOne(ctx context.Context, repoModel *model.Category, col string) error {
	ctx, span := otel.Tracer("category-repository").Start(ctx, "delete-one")
	defer span.End()
	a.logger.For(ctx).Info("Hard deleting category")

	_, err := a.db.NewDelete().Model(repoModel).Where("? = ?", bun.Ident(col), repoModel.Id).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while deleting category", zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}
