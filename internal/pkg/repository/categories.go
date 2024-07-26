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
	SelectOne(ctx context.Context, id string) (*model.Category, error)
	InsertOne(ctx context.Context, category *model.Category) error
	UpdateOne(ctx context.Context, category *model.Category) error
	DeleteOne(ctx context.Context, id string) error
	SoftDeleteOne(ctx context.Context, category *model.Category) error

	// DeleteOne()
	// SelectMany()
	// InsertMany()
	// CreateMany()
	// UpdateMany()
	// DeleteMany()
}

type categoryRepositoryAgent struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *categoryRepositoryAgent) SelectOne(ctx context.Context, id string) (*model.Category, error) {
	ctx, span := otel.Tracer("category-repository").Start(ctx, "SelectOne")
	defer span.End()

	a.logger.For(ctx).Info("Selecting category", zap.String("category", id))

	category := new(model.Category)
	err := a.db.NewSelect().Model(category).Where("id = ?", id).Scan(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while selecting category", zap.String("category", id), zap.String("cause", errors.Cause(err).Error()))
		return nil, err
	}
	return category, nil
}

func (a *categoryRepositoryAgent) InsertOne(ctx context.Context, category *model.Category) error {
	ctx, span := otel.Tracer("category-repository").Start(ctx, "InsertOne")
	defer span.End()

	a.logger.For(ctx).Info("Inserting category", zap.String("category", category.Id))
	_, err := a.db.NewInsert().Model(category).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting category", zap.String("category", category.Id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *categoryRepositoryAgent) UpdateOne(ctx context.Context, category *model.Category) error {
	ctx, span := otel.Tracer("category-repository").Start(ctx, "UpdateOne")
	defer span.End()

	a.logger.For(ctx).Info("Updating category", zap.String("category", category.Id))
	_, err := a.db.NewUpdate().Model(category).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating category", zap.String("category", category.Id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *categoryRepositoryAgent) SoftDeleteOne(ctx context.Context, category *model.Category) error {
	ctx, span := otel.Tracer("category-repository").Start(ctx, "SoftDeleteOne")
	defer span.End()

	a.logger.For(ctx).Info("soft-deleting category", zap.String("category", category.Id))
	_, err := a.db.NewUpdate().Model(category).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while soft-deleting category", zap.String("category", category.Id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil

}

func (a *categoryRepositoryAgent) DeleteOne(ctx context.Context, id string) error {
	ctx, span := otel.Tracer("category-repository").Start(ctx, "DeleteOne")
	defer span.End()

	a.logger.For(ctx).Info("Selecting category", zap.String("category", id))

	category := new(model.Category)
	_, err := a.db.NewDelete().Model(category).Where("id = ?", id).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while deleting category", zap.String("category", id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}
