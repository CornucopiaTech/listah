package v1

import (
	"cornucopia/listah/internal/app/bootstrap"
	"cornucopia/listah/internal/pkg/proto/v1/v1connect"
)

type Server struct {
	*bootstrap.Infra
	v1connect.UnimplementedItemServiceHandler
}

var svcName string = "ItemService"

func NewServer(i *bootstrap.Infra) *Server {
	return &Server{
		Infra: i,
	}
}
