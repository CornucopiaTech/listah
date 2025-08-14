package v1

import (
	"github.com/uptrace/bun"
	"time"
	"connectrpc.com/connect"

	pb "cornucopia/listah/internal/pkg/proto/v1"
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
	CreatedBy pb.AuditUpdaterEnum
	UpdatedBy pb.AuditUpdaterEnum
	DeletedBy pb.AuditUpdaterEnum
	CreatedAt time.Time `bun:",nullzero,default:current_timestamp"`
	UpdatedAt time.Time `bun:",nullzero,default:current_timestamp"`
	DeletedAt time.Time	`bun:",nullzero,default:current_timestamp"`
}


type WhereClause struct {
	Placeholder string
	Column string
	Value interface {}
}


type ItemWhereClause struct {
	Placeholder string
	Column string
	Value []string
}


type UpsertInfo struct {
	Conflict []string
	Resolve []string
}
