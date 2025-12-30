package v1

import (
	"cornucopia/listah/internal/app/bootstrap"
	"cornucopia/listah/internal/pkg/proto/v1/v1connect"
)

type Server struct {
	*bootstrap.Infra
	v1connect.UnimplementedItemServiceHandler
}


type ReadPagination struct {
	PageNumber int32
	PageSize int32
	SortCondition string
}



var svcName string = "listah.v1.ItemService"

var DefaultReadPagination = ReadPagination {
	PageNumber: 1,
	PageSize: 50,
	SortCondition: "user_id ASC, id ASC",
}



func NewServer(i *bootstrap.Infra) *Server {
	return &Server{
		Infra: i,
	}
}
