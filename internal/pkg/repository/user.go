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
	SelectOne(ctx context.Context, user *model.User, col string) error
	SelectMany(ctx context.Context, user *model.Users, col string) error
	InsertOne(ctx context.Context, user *model.User) error
	InsertMany(ctx context.Context, user *model.Users) error
	UpdateOne(ctx context.Context, user *model.User) error
	UpdateMany(ctx context.Context, user *model.Users) error
	DeleteOne(ctx context.Context, user *model.User, col string) error
	SoftDeleteOne(ctx context.Context, user *model.User) error
}

type userRepositoryAgent struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *userRepositoryAgent) SelectOne(ctx context.Context, user *model.User, col string) error {
	ctx, span := otel.Tracer("user-repository").Start(ctx, "Select one")
	defer span.End()
	a.logger.For(ctx).Info("Selecting one from user by column", zap.String("column", col))

	if err := a.db.NewSelect().Model(user).WherePK(col).Scan(ctx); err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while selecting one from user by column", zap.String("column", col), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}
func (a *userRepositoryAgent) SelectMany(ctx context.Context, user *model.Users, col string) error {
	ctx, span := otel.Tracer("user-repository").Start(ctx, "select many")
	defer span.End()

	a.logger.For(ctx).Info("Selecting many from user by column", zap.String("column", col))

	if err := a.db.NewSelect().Model(user).WherePK(col).Scan(ctx); err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while selecting many from user by column", zap.String("column", col), zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}

func (a *userRepositoryAgent) InsertOne(ctx context.Context, user *model.User) error {
	ctx, span := otel.Tracer("user-repository").Start(ctx, "insert-one")
	defer span.End()
	a.logger.For(ctx).Info("Inserting one into user")

	_, err := a.db.NewInsert().Model(user).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting one user", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}
func (a *userRepositoryAgent) InsertMany(ctx context.Context, user *model.Users) error {
	ctx, span := otel.Tracer("user-repository").Start(ctx, "insert-many")
	defer span.End()
	a.logger.For(ctx).Info("Inserting many into user")

	_, err := a.db.NewInsert().Model(user).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting many into user", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *userRepositoryAgent) UpdateOne(ctx context.Context, user *model.User) error {
	ctx, span := otel.Tracer("user-repository").Start(ctx, "update-one")
	defer span.End()
	a.logger.For(ctx).Info("Updating user")

	_, err := a.db.NewUpdate().Model(user).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating one user", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}
func (a *userRepositoryAgent) UpdateMany(ctx context.Context, user *model.Users) error {
	ctx, span := otel.Tracer("user-repository").Start(ctx, "update-many")
	defer span.End()
	a.logger.For(ctx).Info("Updating many user")

	values := a.db.NewValues(user)
	_, err := a.db.NewUpdate().
		With("_data", values).
		Model((*model.User)(nil)).
		TableExpr("_data").
		Set("first_name = _data.first_name").
		Set("middle_names = _data.middle_names").
		Set("last_name = _data.last_name").
		Set("username = _data.username").
		Set("email = _data.email").
		Set("role = _data.role").
		Set("audit = _data.audit").
		Where("u.id::VARCHAR = _data.id").
		Exec(ctx)

	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while updating many user", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *userRepositoryAgent) SoftDeleteOne(ctx context.Context, user *model.User) error {
	ctx, span := otel.Tracer("user-repository").Start(ctx, "soft-delete-one")
	defer span.End()
	a.logger.For(ctx).Info("soft-deleting one user")

	_, err := a.db.NewUpdate().Model(user).WherePK().Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while soft-deleting user", zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}

func (a *userRepositoryAgent) DeleteOne(ctx context.Context, user *model.User, col string) error {
	ctx, span := otel.Tracer("user-repository").Start(ctx, "delete-one")
	defer span.End()
	a.logger.For(ctx).Info("Hard deleting user")

	_, err := a.db.NewDelete().Model(user).Where("? = ?", bun.Ident(col), user.Id).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while hard deleting user", zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}
