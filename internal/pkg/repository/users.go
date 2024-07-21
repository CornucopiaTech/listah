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
	SelectOne(ctx context.Context, id string) *model.User
	InsertOne(ctx context.Context, user *model.User) error
	// CreateOne()
	// UpdateOne()
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

func (a *userRepositoryAgent) SelectOne(ctx context.Context, id string) *model.User {
	ctx, span := otel.Tracer("user-repository").Start(ctx, "SelectOne")
	defer span.End()

	a.logger.For(ctx).Info("Selection user", zap.String("user", id))

	user := new(model.User)
	err := a.db.NewSelect().Model(user).Where("id = ?", id).Scan(ctx)
	if err != nil {
		a.logger.For(ctx).Fatal("Error occurred while selecting user", zap.String("user", id), zap.String("cause", errors.Cause(err).Error()))
	}
	return user
}

func (a *userRepositoryAgent) InsertOne(ctx context.Context, user *model.User) error {
	ctx, span := otel.Tracer("user-repository").Start(ctx, "InsertOne")
	defer span.End()

	a.logger.For(ctx).Info("Inserting user", zap.String("user", user.Id))
	_, err := a.db.NewInsert().Model(user).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Fatal("Error occurred while inserting user", zap.String("user", user.Id), zap.String("cause", errors.Cause(err).Error()))
	}

	return nil
}
