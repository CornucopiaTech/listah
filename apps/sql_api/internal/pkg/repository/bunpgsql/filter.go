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
	Upsert(ctx context.Context, m *[]*model.Filter, c *model.UpsertInfo) (interface{}, error)
}

type filter struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *filter) UpsertWithName(ctx context.Context, m interface{}, c *model.UpsertInfo) (interface{}, error) {
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

	itemCols := append([]string{"id", "user_id"}, c.Resolve...)
	values := a.db.NewValues(m).Column(itemCols...)
	aliasCols := []string{}
	for _, v := range itemCols {
		if v != "tags" {
			aliasCols = append(aliasCols, fmt.Sprintf(`i."%v"`, v))
		}
	}
	// ToDo: Should filter upsert send a list of tag names or list of tag ids.
	query := `
		WITH literals (` + strings.Join(itemCols, ", ") + `) AS (
			?
		)
		SELECT ` + strings.Join(aliasCols, ", ") + `
    	,jsonb_agg(t.id ORDER BY t.id) AS tags
		FROM literals i
			LEFT JOIN LATERAL jsonb_array_elements_text(i.tags) AS elem(tag_name)
				ON TRUE
			LEFT JOIN apps.tags t
					ON t.user_id = i.user_id
					AND t.name = elem.tag_name
		GROUP BY ` + strings.Join(aliasCols, ", ") + `;
	`
	tR := []model.Filter{}
	err := a.db.NewRaw(query, values).Scan(ctx, &tR)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return nil, err
	}

	q := a.db.NewInsert().Model(&tR).Ignore().On(conflict)

	for _, v := range c.Resolve {
		r := fmt.Sprintf("%v = Excluded.%v", v, v)
		q = q.Set(r)
	}

	_, err = q.Exec(ctx)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return nil, err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return nil, nil
}

func (a *filter) Read(ctx context.Context, m *[]*model.Filter, s *model.ItemSearch) (int, error) {
	ctx, span := otel.Tracer("filter-repository").Start(ctx, "FilterRepository Read")
	defer span.End()

	var activity = "ReadFilter"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)
	cte := fmt.Sprintf(`
		WITH filts AS (
			SELECT sf.*, elem.tag_id
			FROM apps.filters sf
				LEFT JOIN  LATERAL JSONB_ARRAY_ELEMENTS_TEXT(sf.tags::JSONB) AS elem(tag_id) ON TRUE
			WHERE sf.user_id = '%v'
				AND (sf.soft_delete = false OR sf.soft_delete IS NULL)
		)
		,its AS (
				SELECT it.*, elem.tag_id
				FROM apps.items it
					LEFT JOIN LATERAL JSONB_ARRAY_ELEMENTS_TEXT(it.tags::JSONB) AS elem(tag_id) ON TRUE
				WHERE it.user_id = '%v'
					AND (it.soft_delete = false OR it.soft_delete IS NULL)
		)
	`, s.UserId, s.UserId)
	query := `
		SELECT
			sf.id, sf.user_id, sf."name", sf.tags::VARCHAR tags,
			SUM(CASE WHEN it.id IS NOT NULL THEN 1 ELSE 0 END) count
		FROM filts sf
			LEFT JOIN its it
				ON sf.user_id = it.user_id
				AND sf.tag_id = it.tag_id
		GROUP BY 1, 2, 3, 4
	`

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

func (a *filter) Upsert(ctx context.Context, m *[]*model.Filter, c *model.UpsertInfo) (interface{}, error) {
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

	_, err := q.Exec(ctx)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return nil, err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return nil, nil
}
