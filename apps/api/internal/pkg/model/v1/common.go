package v1

import (
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"time"
	"fmt"
	"strings"
)

var InvalidJWTMsg = "invalid JWT: "
var FailedJWKSLoadMsg = "failed to load JWKS: "
var MissingTokenMsg = "missing token"
var Unauthorised = errors.New("auth: unauthorised request")
var DuplicateName = errors.New("database: name already exists")
var MissingQuery = errors.New("req: no query present")
var MissingUserId = errors.New("req: no userId in query present")
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

type Pagination struct {
	Page   int64
	Size   int64
	Sort   string
	Volume int64
}

var DefaultPagination = Pagination{
	Page: 1,
	Size: 200,
	Sort: "name ASC",
}

var DefaultPbPagination = &pb.Pagination{
	Page: 1,
	Size: 200,
	Sort: "name ASC",
}

type RowCount struct {
	RowCount int
}

type RepoSearch struct {
	UserId string
	Id     string
	Tags   string
	Text   string
	Sort   string
	Limit  int64
	Offset int64
	Page   int64
}

type UpsertInfo struct {
	Conflict []string
	Resolve  []string
}

// func ReadRequestToRepoSearch(msg *pb.ItemServiceReadItemRequest) (*RepoSearch, error) {
func ReadRequestToRepoSearch(msg *pb.ReadRequest) (*RepoSearch, error) {
	if msg.GetQuery() == nil {
		return nil, MissingQuery
	}
	q := msg.GetQuery()
	if q.UserId == "" {
		return nil, MissingUserId
	}
	t := []string{}
	if q.Tags != nil {
		for _, v := range msg.GetQuery().Tags {
			t = append(t, fmt.Sprintf(`'%v'`, v))
		}
	}

	pSize := DefaultPagination.Size
	pNum := DefaultPagination.Page
	sortT := DefaultPagination.Sort
	pg := msg.GetPagination()
	// fmt.Printf("\npg  %+v\n", pg)
	if pg != nil {
		if pg.Size > 0 {
			pSize = pg.Size
		}
		if pg.Page != pNum {
			pNum = pg.Page
		}
		if pg.Sort != sortT {
			sortT = pg.Sort
		}

	}
	offset := int64(0)
	if pSize > 0 && pNum > 0 {
		offset = pSize * (pNum - 1)
	}

	i := RepoSearch{
		Id: q.GetId(),
		UserId: q.GetUserId(),
		Tags:   strings.Join(t, ", "),
		Text:   q.GetText(),
		Sort:   sortT,
		Limit:  pSize,
		Offset: offset,
		Page:   pNum,
	}
	// fmt.Printf("\nRepo Search -  %+v\n", i)
	return &i, nil
}
