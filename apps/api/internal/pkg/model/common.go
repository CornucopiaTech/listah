package model

import (
	"connectrpc.com/connect"
	"time"
)

type ApiLog struct {
	RequestTime   time.Time
	Request       connect.AnyRequest
	Id            string `bson:"_id"`
	RequestSource string
	TraceId       string
	SpanId        string
	Uri        string
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

type UpsertInfo struct {
	Conflict []string
	Resolve  []string
}
