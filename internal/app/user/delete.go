package user

import (
	"context"
	"cornucopia/listah/internal/pkg/model"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"cornucopia/listah/internal/pkg/utils"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
)

func (s *Server) DeleteOne(ctx context.Context, req *connect.Request[v1.UserServiceDeleteOneRequest]) (*connect.Response[v1.UserServiceDeleteOneResponse], error) {
	ctx, span := otel.Tracer("user-service").Start(ctx, "delete-one")
	defer span.End()
	s.Infra.Logger.For(ctx).Info("DeleteOne method in UserService called")

	// Read initial model from repository
	modelBeforeDelete := model.User{Id: req.Msg.Id}
	if err := s.Infra.Repository.User.SelectOne(ctx, &modelBeforeDelete, "id"); err != nil {
		return nil, err
	}

	// Create model for update from information in request
	deleteModel := new(model.User)
	deleteModel.DeleteUserModelFromRequest(ctx, req.Msg, &modelBeforeDelete)

	// Update model in repository
	if err := s.Infra.Repository.User.SoftDeleteOne(ctx, deleteModel); err != nil {
		return nil, err
	}

	// Read model from repository after soft-delete
	modelAfterDelete := model.User{Id: req.Msg.Id}
	if err := s.Infra.Repository.User.SelectOne(ctx, &modelAfterDelete, "id"); err != nil {
		return nil, err
	}

	// Convert model to generic (create response) proto message
	genericResponse := modelAfterDelete.UserModelToResponse(ctx)

	// Marshal copy from generic (category create response) to response proto message
	responseModel := new(v1.UserServiceDeleteOneResponse)
	utils.MarshalCopyProto(genericResponse, responseModel)

	return connect.NewResponse(responseModel), nil
}
func (s *Server) DeleteMany(ctx context.Context, req *connect.Request[v1.UserServiceDeleteManyRequest]) (*connect.Response[v1.UserServiceDeleteManyResponse], error) {
	panic("Not implemented")
}
