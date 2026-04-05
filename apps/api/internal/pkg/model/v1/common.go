package v1

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
	Limit       int64
	Offset      int64
	PageNumber  int64
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
	bun.BaseModel `bun:"table:apps.filters,alias:sf"`
	Id            string `bun:",pk"`
	UserId        string
	Name          string
	Tags          []string `bun:"type:jsonb"`
	Count         int32
}

type Tag struct {
	bun.BaseModel `bun:"table:apps.tags,alias:t"`
	Id            string `bun:",pk"`
	UserId        string
	Name          string
	Props         map[string]string
	Count         int32
}

type TagUpsert struct {
	bun.BaseModel `bun:"table:apps.tags,alias:t"`
	Id            string `bun:",pk"`
	UserId        string
	Name          string
	Props         map[string]string
}

type Pagination struct {
	PageNumber int64
	PageSize   int64
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

type ItemUpsert struct {
	Items  *[]*Item
	Update []string
	Tags   *[]Tag
}

type TagCte struct {
	Columns string
	Values  string
}
