package v1

import (
	"net/http"
	"time"
	"github.com/pkg/errors"
	"cornucopia/listah/apps/api/internal/app/bootstrap"
	"cornucopia/listah/apps/api/internal/pkg/proto/v1/v1connect"
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

// https://www.digitalocean.com/community/tutorials/how-to-make-http-requests-in-go
// Production HTTP client with advanced configuration
func createClient() *http.Client {
	transport := &http.Transport{
		MaxIdleConns:        100,              // Maximum idle connections
		MaxIdleConnsPerHost: 10,               // Maximum idle connections per host
		IdleConnTimeout:     90 * time.Second, // Idle connection timeout
		DisableCompression:  false,            // Enable compression
		DisableKeepAlives:   false,            // Enable keep-alives
	}

	return &http.Client{
		Transport: transport,
		Timeout:   30 * time.Second,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			// Custom redirect handling
			if len(via) >= 10 {
					return errors.New("stopped after 10 redirects")
			}
			return nil
		},
	}
}
