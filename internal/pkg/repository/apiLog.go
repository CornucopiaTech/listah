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

type ApiLogRepository interface {
	InsertOne(ctx context.Context, repoModel *model.ApiLog) error
}

type apiLogRepositoryAgent struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *apiLogRepositoryAgent) InsertOne(ctx context.Context, repoModel *model.ApiLog) error {
	ctx, span := otel.Tracer("apiLog-repository").Start(ctx, "insert one")
	defer span.End()
	a.logger.For(ctx).Info("Inserting one into apiLog")

	_, err := a.db.NewInsert().Model(repoModel).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting one apiLog", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}
