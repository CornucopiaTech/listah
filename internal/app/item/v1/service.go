package v1

import (
	"cornucopia/listah/internal/app/bootstrap"
	"cornucopia/listah/internal/pkg/proto/v1/v1connect"
)

// ToDo: Learn more about structs in go.
// This struct below was defined without keys but when it is implemented, keys were added to it.
type Server struct {
	*bootstrap.Infra
	v1connect.UnimplementedItemServiceHandler
}

func NewServer(i *bootstrap.Infra) *Server {
	return &Server{
		Infra: i,
	}
}
