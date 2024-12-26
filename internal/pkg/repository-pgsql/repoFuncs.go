package repositoryPgsql

import (
	"github.com/uptrace/bun"
)

func addWhere(q bun.QueryBuilder, where_map map[string]string) bun.QueryBuilder {
	for key, value := range where_map {
		q = q.Where("? = ?", bun.Ident(key), value)
	}
	return q
}
