package category

import (
	"cornucopia/listah/internal/app/bootstrap"
	v1connect "cornucopia/listah/internal/pkg/proto/listah/v1/v1connect"
)

// var tracer

// ToDo: Learn more about structs in go.
// This struct below was defined without keys but when it is implemented, keys were added to it.
type Server struct {
	*bootstrap.Infra
	v1connect.UnimplementedCategoryServiceHandler
}

func NewServer(infra *bootstrap.Infra) *Server {

	return &Server{
		Infra: infra,
	}
}
