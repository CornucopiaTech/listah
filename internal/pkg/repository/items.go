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
	SelectOne(ctx context.Context, id string) (*model.Item, error)
	InsertOne(ctx context.Context, item *model.Item) error
	UpdateOne(ctx context.Context, item *model.Item) error
	DeleteOne(ctx context.Context, id string) error
	SoftDeleteOne(ctx context.Context, item *model.Item) error

	// DeleteOne()
	// SelectMany()
	// InsertMany()
	// CreateMany()
	// UpdateMany()
	// DeleteMany()
}

type itemRepositoryAgent struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *itemRepositoryAgent) SelectOne(ctx context.Context, id string) (*model.Item, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "SelectOne")
	defer span.End()

	a.logger.For(ctx).Info("Selecting item", zap.String("item", id))

	item := new(model.Item)
	err := a.db.NewSelect().Model(item).Where("id = ?", id).Scan(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while selecting item", zap.String("item", id), zap.String("cause", errors.Cause(err).Error()))
		return nil, err
	}
	return item, nil
}

func (a *itemRepositoryAgent) InsertOne(ctx context.Context, item *model.Item) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "InsertOne")
	defer span.End()

	a.logger.For(ctx).Info("Inserting item", zap.String("item", item.Id))
	_, err := a.db.NewInsert().Model(item).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting item", zap.String("item", item.Id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *itemRepositoryAgent) UpdateOne(ctx context.Context, item *model.Item) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "UpdateOne")
	defer span.End()

	a.logger.For(ctx).Info("Updating item", zap.String("item", item.Id))
	_, err := a.db.NewUpdate().Model(item).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating item", zap.String("item", item.Id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *itemRepositoryAgent) SoftDeleteOne(ctx context.Context, item *model.Item) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "SoftDeleteOne")
	defer span.End()

	a.logger.For(ctx).Info("soft-deleting item", zap.String("item", item.Id))
	_, err := a.db.NewUpdate().Model(item).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while soft-deleting item", zap.String("item", item.Id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil

}

func (a *itemRepositoryAgent) DeleteOne(ctx context.Context, id string) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "DeleteOne")
	defer span.End()

	a.logger.For(ctx).Info("Selecting item", zap.String("item", id))

	item := new(model.Item)
	_, err := a.db.NewDelete().Model(item).Where("id = ?", id).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while deleting item", zap.String("item", id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}
