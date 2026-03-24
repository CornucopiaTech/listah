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

type Item struct {
	UpdatedBy  string
	Props      map[string]string
	Id         string `bson:"_id"`
	UserId     string
	Name       string
	UpdatedAt  time.Time
	Tags       []string
	SoftDelete bool
}

type ItemReadResult struct {
	Results    *[]Item
	TotalCount int32
}

type ItemUpsert struct {
	Filter map[string]string
	Update map[string]map[string]interface{}
}

type ItemUpdate struct {
	Filter map[string]string
	Update map[string]map[string]interface{}
}

type ItemReplace struct {
	Filter  map[string]string
	Replace map[string]interface{}
}

type ItemRead struct {
	Filter map[string]interface{}
}
type ItemReadCountFilter struct {
	UserId string
	Tags   []string
}
type Filter struct {
	Id     string `bson:"_id"`
	UserId string
	Name   string
	Tags   []string
	Count  int32
}

type Tag struct {
	UserId string
	Name   string
	Count  int32
}

type RowCount struct {
	RowCount int
}

type Pagination struct {
	PageNumber int32
	PageSize   int32
	Sort       string
}

var DefaultPagination = Pagination{
	PageNumber: 1,
	PageSize:   100,
	Sort:       "name ASC",
}
