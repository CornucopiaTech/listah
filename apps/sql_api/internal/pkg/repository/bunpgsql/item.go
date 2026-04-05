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
	ReadItem(ctx context.Context, m *[]*model.Item, s *model.ItemSearch) (int, error)
	ReadTag(ctx context.Context, m *[]*model.Tag, s *model.ItemSearch) (int, error)
	ReadFilter(ctx context.Context, m *[]*model.Filter, s *model.ItemSearch) (int, error)
	Upsert(ctx context.Context, m *[]*model.Item, c *model.UpsertInfo) (interface{}, error)
}

type item struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *item) PrevReadItem(ctx context.Context, m *[]*model.Item, s *model.ItemSearch) (int, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Read")
	defer span.End()

	var activity = "ItemRead"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	query := `
		SELECT
			it."id", it."user_id", it."name", it."note",
			it."props", it."tags", it."soft_delete"
		FROM apps.items it
			FULL OUTER JOIN apps.filters sf
				ON sf.user_id = it.user_id
				AND it.tags::JSONB @> sf.tags::jsonb
		WHERE it.user_id::VARCHAR = '` + s.UserId + `'
			AND (it.soft_delete = false OR it.soft_delete IS NULL)
	`

	if s.SearchQuery != "" {
		n := `
			AND (
				it.name LIKE '%` + s.SearchQuery + `%' OR
				it.note LIKE '%` + s.SearchQuery + `%' OR
				it.props::VARCHAR LIKE '%` + s.SearchQuery + `%' OR
				it.tags::VARCHAR LIKE '%` + s.SearchQuery + `%'
			)
		`
		query = query + n
	}
	if s.Tags != "" {
		n := ` AND (
			it.tags::VARCHAR = ` + s.Tags + ` OR it.tags::VARCHAR != 'null' AND it.tags::JSONB ?| array[` + s.Tags + `]
		) `
		query = query + n
	}
	if s.Filters != "" {
		n := ` AND (
			sf.name IS NOT NULL AND sf.id IN (` + s.Filters + `)
		) `
		query = query + n
	}

	countq := `
		SELECT COUNT(*) row_count
		FROM (
			` + query + `
		)`
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

	err = a.db.NewRaw(query).Scan(ctx, m)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return 0, err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return recCnt[0].RowCount, nil
}

func (a *item) ReadItem(ctx context.Context, m *[]*model.Item, s *model.ItemSearch) (int, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Read")
	defer span.End()

	var activity = "ItemRead"
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

	query := `
		SELECT it.*
		FROM items it
			FULL OUTER JOIN apps.filters sf
				ON sf.user_id = it.user_id
				AND it.tags::JSONB @> sf.tags::JSONB
		WHERE it.user_id::VARCHAR = '` + s.UserId + `'
			AND (it.soft_delete = false OR it.soft_delete IS NULL)
	`

	if s.SearchQuery != "" {
		n := `
			AND (
				it.name LIKE '%` + s.SearchQuery + `%' OR
				it.note LIKE '%` + s.SearchQuery + `%' OR
				it.props::VARCHAR LIKE '%` + s.SearchQuery + `%' OR
				it.tags::VARCHAR LIKE '%` + s.SearchQuery + `%'
			)
		`
		query = query + n
	}
	if s.Tags != "" {
		n := ` AND (
			it.tags::VARCHAR = ` + s.Tags + ` OR it.tags::VARCHAR != 'null' AND it.tags::JSONB ?| array[` + s.Tags + `]
		) `
		query = query + n
	}
	if s.Filters != "" {
		n := ` AND (
			sf.name IS NOT NULL AND sf.id IN (` + s.Filters + `)
		) `
		query = query + n
	}

	countq := cte + `
		SELECT COUNT(*) row_count
		FROM (
			` + query + `
		)`
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

func (a *item) ReadTag(ctx context.Context, m *[]*model.Tag, s *model.ItemSearch) (int, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Read Tag Group")
	defer span.End()

	var activity = "Read Tag Group"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	where := "1 = 1"
	if s.SearchQuery != "" {
		where = where + " AND name LIKE '%" + s.SearchQuery + "%' "
	}

	query := `
		SELECT 'null' id, name, COUNT(*) AS count
		FROM (
			SELECT DISTINCT id, jsonb_array_elements_text(tags::JSONB) AS name
			FROM apps.items it
			WHERE tags::VARCHAR != 'null' AND user_id::VARCHAR = '` + s.UserId + `'
				AND (it.soft_delete = false OR it.soft_delete IS NULL)
			UNION ALL
			SELECT DISTINCT id, 'null' AS name
			FROM apps.items it
			WHERE tags::VARCHAR = 'null'
				AND (it.soft_delete = false OR it.soft_delete IS NULL)
		) AS expanded
		WHERE ` + where + `
		GROUP BY 1, 2
	`

	countq := fmt.Sprintf(`SELECT COUNT(*) row_count FROM (%v)`, query)
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
	err = a.db.NewRaw(query).Scan(ctx, m)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return 0, err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return recCnt[0].RowCount, nil
}

func (a *item) ReadFilter(ctx context.Context, m *[]*model.Filter, s *model.ItemSearch) (int, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Read")
	defer span.End()

	var activity = "ItemSavedFilter"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	query := fmt.Sprintf(`
		SELECT
			sf.id, sf."name",
			SUM(CASE WHEN it.id IS NOT NULL THEN 1 ELSE 0 END) count
		FROM apps.filters sf
			LEFT JOIN apps.items it
				ON sf.user_id = it.user_id
				AND it.tags::JSONB @> sf.tags::jsonb
		WHERE sf.user_id::VARCHAR = '%v'
				AND (it.soft_delete = false OR it.soft_delete IS NULL)
		GROUP BY 1, 2
	`, s.UserId)

	countq := fmt.Sprintf(`SELECT COUNT(*) row_count FROM (%v)`, query)
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
	err = a.db.NewRaw(query).Scan(ctx, m)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return 0, err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return recCnt[0].RowCount, nil
}

func (a *item) PrevUpsert(ctx context.Context, m interface{}, c *model.UpsertInfo, t *[]string) (interface{}, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Upsert")
	defer span.End()

	var activity = "ItemUpsert"
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
	query := `
		WITH itemLiterals (` + strings.Join(itemCols, ", ") + `) AS (
			?
		)
		SELECT ` + strings.Join(aliasCols, ", ") + `
    	,jsonb_agg(t.id ORDER BY t.id) AS tags
		FROM itemLiterals i
			LEFT JOIN LATERAL jsonb_array_elements_text(i.tags) AS elem(tag_name)
				ON TRUE
			LEFT JOIN apps.tags t
					ON t.user_id = i.user_id
					AND t.name = elem.tag_name
		GROUP BY ` + strings.Join(aliasCols, ", ") + `;
	`
	tR := []model.Item{}
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
