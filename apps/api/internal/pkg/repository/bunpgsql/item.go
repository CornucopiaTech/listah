package bunpgsql

import (
	"context"
	"cornucopia/listah/apps/api/internal/pkg/logging"
	"cornucopia/listah/apps/api/internal/pkg/model"
	"fmt"
	"strings"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"go.opentelemetry.io/otel"
	v1model "cornucopia/listah/apps/api/internal/pkg/model/v1"
)

var svcName string = "PgDB"

type Item interface {
	ReadItem(ctx context.Context, m *[]*v1model.Item, s *model.ItemSearch) (int, error)
	// ReadCategory(ctx context.Context, m *[]*v1model.Category, s *model.ItemSearch) (int, error)
	ReadTag(ctx context.Context, m *[]*v1model.Category, s *model.ItemSearch) (int, error)
	ReadSavedFilter(ctx context.Context, m *[]*v1model.Category, s *model.ItemSearch) (int, error)
	Upsert(ctx context.Context, m interface{}, c *model.UpsertInfo) (interface{}, error)
}

type item struct {
	db     *bun.DB
	logger *logging.Factory
}


func (a *item) ReadItem(ctx context.Context, m *[]*v1model.Item, s *model.ItemSearch) (int, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Read")
	defer span.End()

	var activity = "ItemRead"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	query := `
		SELECT it."id", it."user_id", it."title", it."description",
			it."note", it."tag", it."soft_delete", it."reactivate_at"
		FROM apps.items it
			FULL OUTER JOIN apps.saved_filters sf
				ON sf.user_id = it.user_id
				AND it.tag::JSONB @> sf.tags::jsonb
		WHERE it.user_id::VARCHAR = '` + s.UserId + `'
			AND (it.soft_delete = false OR it.soft_delete IS NULL)
	`


	if s.SearchQuery != "" {
		n := `
			AND (
				it.title LIKE '%`+ s.SearchQuery + `%' OR
				it.description LIKE '%`+ s.SearchQuery + `%' OR
				it.note LIKE '%`+ s.SearchQuery + `%'
			)
		`
		query = query + n
	}
	if s.Tags != "" {
		n := ` AND (
			it.tag::VARCHAR = ` + s.Tags + ` OR it.tag::VARCHAR != 'null' AND it.tag::JSONB ?| array[` + s.Tags + `]
		) `
		query = query + n
	}
	if s.SavedFilters != "" {
		n := ` AND (
			sf.name IS NOT NULL AND sf.id IN (` + s.SavedFilters +`)
		) `
		query = query + n
	}

	countq := `
		SELECT COUNT(*) row_count
		FROM (
			` + query + `
		)`
	recCnt := []*v1model.RowCount{}
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

func (a *item) ReadTag(ctx context.Context, m *[]*v1model.Category, s *model.ItemSearch) (int, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Read Tag Group")
	defer span.End()

	var activity = "Read Tag Group"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	query := fmt.Sprintf(`
		SELECT 'null' id, category, COUNT(*) AS row_count
		FROM (
			SELECT DISTINCT id, jsonb_array_elements_text(tag::JSONB) AS category
			FROM apps.items it
			WHERE tag::VARCHAR != 'null' AND user_id::VARCHAR = '%v'
				AND (it.soft_delete = false OR it.soft_delete IS NULL)
			UNION ALL
			SELECT DISTINCT id, 'null' AS category
			FROM apps.items it
			WHERE tag::VARCHAR = 'null'
				AND (it.soft_delete = false OR it.soft_delete IS NULL)
		) AS expanded
		GROUP BY 1, 2
		ORDER BY 1
	`, s.UserId)

	countq := fmt.Sprintf(`SELECT COUNT(*) row_count FROM (%v)`, query)
	recCnt := []*v1model.RowCount{}
	err := a.db.NewRaw(countq).Scan(ctx, &recCnt)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred while getting total population", errors.Cause(err).Error())
		return 0, err
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

func (a *item) ReadSavedFilter(ctx context.Context, m *[]*v1model.Category, s *model.ItemSearch) (int, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Read")
	defer span.End()

	var activity = "ItemSavedFilter"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	query := fmt.Sprintf(`
		SELECT sf.id, sf."name" category, SUM(CASE WHEN it.id IS NOT NULL THEN 1 ELSE 0 END) row_count
		FROM apps.saved_filters sf
			LEFT JOIN apps.items it
				ON sf.user_id = it.user_id
				AND it.tag::JSONB @> sf.tags::jsonb
		WHERE sf.user_id::VARCHAR = '%v'
				AND (it.soft_delete = false OR it.soft_delete IS NULL)
		GROUP BY 1, 2
	`, s.UserId)

	countq := fmt.Sprintf(`SELECT COUNT(*) row_count FROM (%v)`, query)
	recCnt := []*v1model.RowCount{}
	err := a.db.NewRaw(countq).Scan(ctx, &recCnt)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred while getting total population", errors.Cause(err).Error())
		return 0, err
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


func (a *item) Upsert(ctx context.Context, m interface{}, c *model.UpsertInfo) (interface{}, error) {
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
