package user

import (
	pb "cornucopia/listah/internal/pkg/proto/listah/v1"
)

type service struct {
	pb.UnimplementedUserServiceServer
}

func NewUserServer() *service {
	return &service{}
}
