package model

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

type ItemSearch struct {
	UserId       string
	Tags         string
	SavedFilters string
	SearchQuery  string
	SortQuery    string
	Limit        int
	Offset       int
	PageNumber   int
}

// type Pagination struct {
// 	Sort       string
// 	PageNumber int32
// 	PageSize   int32
// }

type UpsertInfo struct {
	Conflict []string
	Resolve  []string
}
