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

type UserRepository interface {
	SelectOne(ctx context.Context, id string) (*model.User, error)
	InsertOne(ctx context.Context, user *model.User) error
	UpdateOne(ctx context.Context, user *model.User) error
	DeleteOne(ctx context.Context, id string) error
	SoftDeleteOne(ctx context.Context, user *model.User) error

	// DeleteOne()
	// SelectMany()
	// InsertMany()
	// CreateMany()
	// UpdateMany()
	// DeleteMany()
}

type userRepositoryAgent struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *userRepositoryAgent) SelectOne(ctx context.Context, id string) (*model.User, error) {
	ctx, span := otel.Tracer("user-repository").Start(ctx, "SelectOne")
	defer span.End()

	a.logger.For(ctx).Info("Selecting user", zap.String("user", id))

	user := new(model.User)
	err := a.db.NewSelect().Model(user).Where("id = ?", id).Scan(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while selecting user", zap.String("user", id), zap.String("cause", errors.Cause(err).Error()))
		return nil, err
	}
	return user, nil
}

func (a *userRepositoryAgent) InsertOne(ctx context.Context, user *model.User) error {
	ctx, span := otel.Tracer("user-repository").Start(ctx, "InsertOne")
	defer span.End()

	a.logger.For(ctx).Info("Inserting user", zap.String("user", user.Id))
	_, err := a.db.NewInsert().Model(user).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting user", zap.String("user", user.Id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *userRepositoryAgent) UpdateOne(ctx context.Context, user *model.User) error {
	ctx, span := otel.Tracer("user-repository").Start(ctx, "UpdateOne")
	defer span.End()

	a.logger.For(ctx).Info("Updating user", zap.String("user", user.Id))
	_, err := a.db.NewUpdate().Model(user).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating user", zap.String("user", user.Id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *userRepositoryAgent) SoftDeleteOne(ctx context.Context, user *model.User) error {
	ctx, span := otel.Tracer("user-repository").Start(ctx, "SoftDeleteOne")
	defer span.End()

	a.logger.For(ctx).Info("soft-deleting user", zap.String("user", user.Id))
	_, err := a.db.NewUpdate().Model(user).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while soft-deleting user", zap.String("user", user.Id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil

}

func (a *userRepositoryAgent) DeleteOne(ctx context.Context, id string) error {
	ctx, span := otel.Tracer("user-repository").Start(ctx, "DeleteOne")
	defer span.End()

	a.logger.For(ctx).Info("Selecting user", zap.String("user", id))

	user := new(model.User)
	_, err := a.db.NewDelete().Model(user).Where("id = ?", id).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while deleting user", zap.String("user", id), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}
