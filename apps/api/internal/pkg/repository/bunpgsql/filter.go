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

type Filter interface {
	Read(ctx context.Context, m *[]*model.Filter, s *model.ItemSearch) (int, error)
	Upsert(ctx context.Context, m interface{}, c *model.UpsertInfo) (interface{}, error)
}

type filter struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *filter) Read(ctx context.Context, m *[]*model.Filter, s *model.ItemSearch) (int, error) {
	ctx, span := otel.Tracer("filter-repository").Start(ctx, "FilterRepository Read")
	defer span.End()

	var activity = "FilterSavedFilter"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)
	cte := `
		WITH items AS (
			SELECT
				it."id", it."user_id", it."name", it."note",
				it."props", it."soft_delete"
				,jsonb_agg(DISTINCT t.name ORDER BY t.name) AS tags
			FROM apps.items it
				LEFT JOIN LATERAL jsonb_array_elements_text(it.tags::JSONB) AS elem(tag_id)
					ON TRUE
				LEFT JOIN apps.tags t ON t.user_id = it.user_id AND t.id = elem.tag_id
				GROUP BY it.id
		)
	`
	query := fmt.Sprintf(`
		SELECT
			sf.id, sf.user_id, sf."name", sf.tags,
			SUM(CASE WHEN it.id IS NOT NULL THEN 1 ELSE 0 END) count
		FROM apps.filters sf
			LEFT JOIN items it
				ON sf.user_id = it.user_id
				AND sf.tags::JSONB  @> it.tags::JSONB
		WHERE sf.user_id::VARCHAR = '%v'
				AND (it.soft_delete = false OR it.soft_delete IS NULL)
		GROUP BY 1, 2, 3, 4::VARCHAR
	`, s.UserId)

	countq := cte + fmt.Sprintf(`SELECT COUNT(*) row_count FROM (%v)`, query)
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

func (a *filter) Upsert(ctx context.Context, m interface{}, c *model.UpsertInfo) (interface{}, error) {
	ctx, span := otel.Tracer("filter-repository").Start(ctx, "FilterRepository Upsert")
	defer span.End()

	var activity = "FilterUpsert"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	var conflict string
	if len(c.Resolve) == 0 {
		conflict = fmt.Sprintf("CONFLICT(%v) DO NOTHING",
			strings.Join(c.Conflict, ", "))
	} else {
		conflict = fmt.Sprintf("CONFLICT(%v) DO UPDATE",
			strings.Join(c.Conflict, ", "))
	}

	q := a.db.NewInsert().Model(m).Ignore().On(conflict)

	for _, v := range c.Resolve {
		r := fmt.Sprintf("%v = Excluded.%v", v, v)
		q = q.Set(r)
	}

	res, err := q.Exec(ctx)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return nil, err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return res, nil
}
