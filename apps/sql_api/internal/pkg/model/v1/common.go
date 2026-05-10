package v1

import (
	"time"

	"connectrpc.com/connect"
	"github.com/uptrace/bun"
)

type MapObj struct {
  Key string
  Value string
}

type ApiLog struct {
	bun.BaseModel `bun:"table:instrumentation.logs,alias:lg"`
	Id            string `bun:",pk"`
	RequestSource string
	TraceId       string
	SpanId        string
	Request       connect.AnyRequest
	RequestTime   time.Time
}

type Tag struct {
	bun.BaseModel `bun:"table:apps.tags,alias:t"`
	Id            string `bun:",pk"`
	UserId        string
	Name          string
	Props         []string
	Count         int32 `bun:",scanonly"`
	SoftDelete    bool
	UpdatedBy     string
	UpdatedAt     time.Time
}

type Item struct {
	bun.BaseModel `bun:"table:apps.items,alias:it"`
	Id            string `bun:",pk"`
	UserId        string
	Name          string
	Note          string
	Tags          []string          `bun:"type:jsonb"`
	Props         map[string]string `bun:"type:jsonb"`
	SoftDelete    bool              `bun:",nullzero,default:false"`
	TagObjs        []Tag          `bun:"type:jsonb,scanonly"`
	PropObjs      []MapObj          `bun:"type:jsonb,scanonly"`
	UpdatedBy     string
	UpdatedAt     time.Time
}

type TagProperty struct {
	UserId        string
	Name          string
	TagObjs          []Tag          `bun:"type:jsonb,scanonly"`
}

type StringList struct {
	Value        []string
}

type TagPropertyMap struct {
	Value        map[string]StringList
}

type TagPropertyMapModel struct {
	Props        map[string][]string
}


type Filter struct {
	bun.BaseModel `bun:"table:apps.filters,alias:sf"`
	Id            string `bun:",pk"`
	UserId        string
	Name          string
	Tags          []string `bun:"type:jsonb"`
	Count         int32    `bun:",scanonly"`
	SoftDelete    bool
	UpdatedBy     string
	UpdatedAt     time.Time
}

type Pagination struct {
	PageNumber int64
	PageSize   int64
	Sort       string
}

type RowCount struct {
	RowCount int
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

type UpsertInfo struct {
	Conflict []string
	Resolve  []string
}

type ItemUpsert struct {
	Items  *[]*Item
	Update []string
	Tags   *[]Tag
}
