package pgsql

import (
	"context"
	"cornucopia/listah/internal/pkg/logging"

	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)


type ApiLog interface {
	Insert(ctx context.Context, m interface{}) error
}

type apilog struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *apilog) Insert(ctx context.Context, m interface{}) error {
	ctx, span := otel.Tracer("apilog-repository").Start(ctx, "insert one")
	defer span.End()
	a.logger.For(ctx).Info("Inserting one into apilog")

	_, err := a.db.NewInsert().Model(m).Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting one apilog", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}
