package model

import (
	"connectrpc.com/connect"
	"github.com/uptrace/bun"
)

type ApiLog struct {
	bun.BaseModel `bun:"table:logs.api_logs,alias:al"`
	Id            string `bun:",pk"`
	TraceId       string
	SpanId        string
	Request       connect.AnyRequest
}
