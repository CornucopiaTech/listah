package v1

import (
	"time"

	"github.com/pkg/errors"
	"github.com/uptrace/bun"
)

var InvalidJWTMsg = "invalid JWT: "
var FailedJWKSLoadMsg = "failed to load JWKS: "
var MissingTokenMsg = "missing token"
var Unauthorised = errors.New("auth: unauthorised request")
var DuplicateName = errors.New("database: name already exists")
var MissingUserId = errors.New("req: no userId present")
var MissingName = errors.New("req: no name present")
var MissingTags = errors.New("req: at least one tag is required")
var MissingProps = errors.New("req: at least one property is required")

type MapObj struct {
	Key   string
	Value string
}
type DbReq struct {
	Header interface{}
	Msg    interface{}
}

type ApiLog struct {
	bun.BaseModel `bun:"table:instrumentation.logs,alias:lg"`
	Id            string `bun:",pk"`
	RequestSource string
	Method        string
	TraceId       string
	SpanId        string
	Request       DbReq
	RequestTime   time.Time
}

type ErrorLog struct {
	bun.BaseModel `bun:"table:instrumentation.errors,alias:er"`
	Id            string `bun:",pk"`
	RequestSource string
	Method        string
	TraceId       string
	SpanId        string
	Request       DbReq
	Code          string
	Error         string
	ResponseTime  time.Time
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
	TagObjs       []Tag             `bun:"type:jsonb,scanonly"`
	PropObjs      []MapObj          `bun:"type:jsonb,scanonly"`
	UpdatedBy     string
	UpdatedAt     time.Time
}

type TagProperty struct {
	UserId  string
	Name    string
	TagObjs []Tag `bun:"type:jsonb,scanonly"`
}

type StringList struct {
	Value []string
}

type TagPropertyMap struct {
	Value map[string]StringList
}

type TagPropertyMapModel struct {
	Props map[string][]string
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
