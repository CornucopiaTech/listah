package bunpgsql

import (
	"context"
	"cornucopia/listah/internal/pkg/logging"
	model "cornucopia/listah/internal/pkg/model/v1"
	"fmt"
	"strings"

	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"go.opentelemetry.io/otel"
)

var svcName string = "PgDB"

type Item interface {
	Read(ctx context.Context, m *[]*model.Item, s *model.ItemSearch) (int, error)
	Upsert(ctx context.Context, m *[]*model.Item, c *model.UpsertInfo) (interface{}, error)
}

type item struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *item) Read(ctx context.Context, m *[]*model.Item, s *model.ItemSearch) (int, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Read")
	defer span.End()

	var activity = "ItemRead"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	cte := `
		WITH items AS (
			SELECT
				it.id ,it.user_id ,it.name ,it.note ,it.props
				,it.tags ,it.soft_delete
				,json_agg(DISTINCT jsonb_build_object(
					'id', tg.id, 'user_id', tg.user_id,  'name', tg."name"
					,'props', tg.props, 'soft_delete', tg.soft_delete
				)) tag_objs
				,jsonb_agg(DISTINCT prop_arr) prop_objs
			FROM apps.items it
				LEFT JOIN LATERAL jsonb_array_elements_text(it.tags::JSONB) AS elem(tag_id) ON TRUE
				LEFT JOIN apps.tags tg ON tg.id = elem.tag_id AND tg.user_id = it.user_id
				CROSS JOIN LATERAL jsonb_each_text(it.props::JSONB) AS prop_arr
			GROUP BY it.id, it.user_id
		)
	`

	query := `SELECT it.*
		FROM items it
		WHERE it.user_id::VARCHAR = '` + s.UserId + `'
			AND (it.soft_delete = false OR it.soft_delete IS NULL)
	`

	if s.SearchQuery != "" {
		n := `AND (
				it.name LIKE '%` + s.SearchQuery + `%' OR
				it.note LIKE '%` + s.SearchQuery + `%' OR
				it.props::VARCHAR LIKE '%` + s.SearchQuery + `%' OR
				it.tag_names::VARCHAR LIKE '%` + s.SearchQuery + `%'
			)
		`
		query = query + n
	}
	if s.Tags != "" {
		n := ` AND it.tags::VARCHAR != 'null'
			AND it.tags::JSONB ?| array[` + s.Tags + `]`
		query = query + n
	}

	countq := cte + `SELECT COUNT(*) row_count FROM (` + query + `)`
	recCnt := []*model.RowCount{}
	err := a.db.NewRaw(countq).Scan(ctx, &recCnt)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred while getting total population", errors.Cause(err).Error())
		return 0, err
	}

	if s.SortQuery != "" {
		query = query + fmt.Sprintf(` ORDER BY %v `, s.SortQuery)
	}
	if s.Limit > 0 {
		query = query + fmt.Sprintf(` LIMIT %d `, s.Limit)
	}
	if s.Offset > 0 {
		query = query + fmt.Sprintf(` OFFSET %d `, s.Offset)
	}

	err = a.db.NewRaw(cte+query).Scan(ctx, m)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return 0, err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return recCnt[0].RowCount, nil
}

func (a *item) Upsert(ctx context.Context, m *[]*model.Item, c *model.UpsertInfo) (interface{}, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Upsert")
	defer span.End()

	var activity = "ItemUpsert"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	if len(*m) == 0 {
		a.logger.LogInfo(ctx, svcName, activity, "No items to upsert")
		return nil, nil
	}

	var conflict string
	if len(c.Resolve) == 0 {
		conflict = fmt.Sprintf("CONFLICT(%v) DO NOTHING", strings.Join(c.Conflict, ", "))
	} else {
		conflict = fmt.Sprintf("CONFLICT(%v) DO UPDATE", strings.Join(c.Conflict, ", "))
	}


	q := a.db.NewInsert().Model(m).Ignore().On(conflict)

	for _, v := range c.Resolve {
		r := fmt.Sprintf("%v = Excluded.%v", v, v)
		q = q.Set(r)
	}

	_, err := q.Exec(ctx)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return nil, err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return nil, nil
}
