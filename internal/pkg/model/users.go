package model

import "github.com/uptrace/bun"

type User struct {
	bun.BaseModel `bun:"table:app.users,alias:u"`
	Id            string
	FirstName     string
	MiddleNames   string
	LastName      string
	Username      string
	Email         string
	Role          string
	Audit         Audit
}
