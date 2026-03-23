package model

import (
	"time"

	"connectrpc.com/connect"
	"github.com/uptrace/bun"
)

type ApiLog struct {
	bun.BaseModel `bun:"table:instrumentation.logs,alias:lg"`
	Id            string `bun:",pk"`
	RequestSource string
	TraceId       string
	SpanId        string
	Request       connect.AnyRequest
	RequestTime   time.Time
}

type ItemSearch struct {
	UserId      string
	Tags        string
	Filters     string
	SearchQuery string
	SortQuery   string
	Limit       int32
	Offset      int32
	PageNumber  int32
}

type ItemSearchText struct {
	Tags    string
	Filters string
	Text    string
}

type UpsertInfo struct {
	Conflict []string
	Resolve  []string
}

type Filter struct {
	bun.BaseModel `bun:"table:apps.saved_filters,alias:sf"`
	Id            string `bun:",pk"`
	UserId        string
	Name          string
	Tags          []string `bun:"type:jsonb"`
	Count         int32
}

type Tag struct {
	// bun.BaseModel `bun:"table:apps.tags,alias:t"`
	// Id            string `bun:",pk"`
	UserId string
	Name   string
	Count  int32
}

type Item struct {
	bun.BaseModel `bun:"table:apps.items,alias:it"`
	Id            string `bun:",pk"`
	UserId        string
	Name          string
	Note          string
	Tags          []string `bun:"type:jsonb"`
	Props         map[string]string
	SoftDelete    bool `bun:",nullzero,default:false"`
	UpdatedBy     string
	UpdatedAt     time.Time
}

type Pagination struct {
	PageNumber int32
	PageSize   int32
	Sort       string
}

type RowCount struct {
	RowCount int
}

type Category struct {
	Category string
	RowCount int
	Id       string
}
