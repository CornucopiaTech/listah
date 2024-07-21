package model

import (
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
)

// type Audit struct {
// 	CreatedBy string
// 	CreatedAt datetime.DateTime
// 	UpdatedBy string
// 	UpdatedAt datetime.DateTime
// }

type Audit struct {
	CreatedBy v1.AuditUpdaterEnum
	CreatedAt string
	// CreatedAt datetime.DateTime
	UpdatedBy v1.AuditUpdaterEnum
	UpdatedAt string
	// UpdatedAt datetime.DateTime
}

// type AuditUpdaterEnum struct {
// 	AUDIT_UPDATER_ENUM_UNSPECIFIED int
// 	AUDIT_UPDATER_ENUM_FRONTEND    int
// 	AUDIT_UPDATER_ENUM_SYSOPS      int
// }
