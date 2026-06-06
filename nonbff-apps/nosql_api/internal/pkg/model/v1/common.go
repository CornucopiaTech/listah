package v1

import (
	"time"

	"connectrpc.com/connect"
)

type ApiLog struct {
	RequestTime   time.Time
	Request       connect.AnyRequest
	Id            string `bson:"_id"`
	RequestSource string
	TraceId       string
	SpanId        string
	Uri           string
}

type RepoUpdate struct {
	Filter map[string]string
	Update map[string]map[string]interface{}
}

type RepoReadCountFilter struct {
	UserId     string
	Tags       []string
	Search     string
	Pagination Pagination
}

type Tag struct {
	Id     string `bson:"_id"`
	UserId string
	Name   string
	Count  int32
}

type RowCount struct {
	RowCount int
}

type Pagination struct {
	PageNumber int64
	PageSize   int64
	Sort       string
}

var DefaultPagination = Pagination{
	PageNumber: 0,
	PageSize:   9007199254740991,
	Sort:       "name ASC",
}
