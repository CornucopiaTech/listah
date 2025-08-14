package v1

import (
	"cornucopia/listah/internal/app/bootstrap"
	"cornucopia/listah/internal/pkg/proto/v1/v1connect"
		pb "cornucopia/listah/internal/pkg/proto/v1"
)

type Server struct {
	*bootstrap.Infra
	v1connect.UnimplementedItemServiceHandler
}

var svcName string = "listah.v1.ItemService"
var DefaultReadPagination = pb.Pagination{
	PageNumber: 1,
	RecordsPerPage: 100,
	SortCondition: map[string]string{"user_id": "ASC", "id": "ASC"},
}



func NewServer(i *bootstrap.Infra) *Server {
	return &Server{
		Infra: i,
	}
}
