package sqlpgsql

import (
	"github.com/uptrace/bun"
	"cornucopia/listah/internal/pkg/model"
)

func addWhere(q bun.QueryBuilder, m *[]model.WhereClause) bun.QueryBuilder {
	for _,k := range *m {
		q = q.Where(k.Placeholder, bun.Ident(k.Column), k.Value)
	}
	return q
}
