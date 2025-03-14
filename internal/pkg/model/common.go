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



type Audit struct {
	CreatedBy string
	UpdatedBy string
	DeletedBy string
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt time.Time
}


type WhereClause struct {
	Placeholder string
	Column string
	Value interface {}
}


type UpsertInfo struct {
	Conflict []string
	Resolve []string
}
