package bunpgsql

import (
	"context"
	"cornucopia/listah/internal/pkg/logging"

	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"go.opentelemetry.io/otel"
)

type ApiLog interface {
	Insert(ctx context.Context, m interface{}) error
}

type apilog struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *apilog) Insert(ctx context.Context, m interface{}) error {
	ctx, span := otel.Tracer("apilog-repository").Start(ctx, "ApiLogRepository Insert")
	defer span.End()
	var activity = "ApiLogInsert"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	_, err := a.db.NewInsert().Model(m).Exec(ctx)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return nil
}
