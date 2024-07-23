package model

import (
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"time"
)

type Audit struct {
	CreatedBy v1.AuditUpdaterEnum
	CreatedAt time.Time
	UpdatedBy v1.AuditUpdaterEnum
	UpdatedAt time.Time
}
