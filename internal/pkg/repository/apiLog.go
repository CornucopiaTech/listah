package repository

import (
	"context"
	"cornucopia/listah/internal/pkg/model"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

type ApiLogRepository interface {
	InsertOne(ctx context.Context, repoModel *model.ApiLog) (*mongo.InsertOneResult, error)
}

// type apiLogRepositoryAgent struct {
// 	db     *bun.DB
// 	logger *logging.Factory
// }

// type repositoryAgent struct {
// 	context        *context.Context
// 	client         *mongo.Client
// 	collectionName string
// 	collection     *mongo.Collection
// }

func (a *repositoryAgent) InsertOne(ctx context.Context, repoModel *model.ApiLog) (*mongo.InsertOneResult, error) {
	ctx, span := otel.Tracer("apiLog-repository").Start(ctx, "insert one")
	defer span.End()
	a.logger.For(ctx).Info("Inserting one into apiLog")

	res, err := a.collection.InsertOne(ctx, repoModel)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting one into apiLog", zap.String("cause", errors.Cause(err).Error()))
		return nil, err
	}

	return res, nil
}
