package mongoDB

import (
	"context"
	"cornucopia/listah/internal/pkg/logging"
	"cornucopia/listah/internal/pkg/model"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/v2/mongo"
	// "go.mongodb.org/mongo-driver/mongo"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

type ApiLog interface {
	Insert(ctx context.Context, repoModel *model.ApiLog) error
}

type apiLogAgent struct {
	logger     *logging.Factory
	client     *mongo.Client
	collection *mongo.Collection
}

func (a *apiLogAgent) Insert(ctx context.Context, repoModel *model.ApiLog) error {
	ctx, span := otel.Tracer("apiLog-repository").Start(ctx, "insert one")
	defer span.End()
	a.logger.For(ctx).Info("Inserting one into apiLog")
	_, err := a.collection.InsertOne(ctx, repoModel)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting one into apiLog", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}
