package model

import (
	"github.com/uptrace/bun"
	"time"
	"connectrpc.com/connect"
)

type ApiLog struct {
	bun.BaseModel `bun:"table:instrumentation.logs,alias:lg"`
	Id            string `bun:",pk"`
	RequestSource string
	TraceId       string
	SpanId        string
	Request       connect.AnyRequest
	RequestTime  time.Time
}



type ItemSearch struct {
	UserId string
	Filter string
	SearchQuery string
	SortQuery string
	Limit int
	Offset int
	PageNumber int
}


type UpsertInfo struct {
	Conflict []string
	Resolve []string
}
