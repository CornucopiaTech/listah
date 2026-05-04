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

type Tag interface {
	Upsert(ctx context.Context, m *[]*model.Tag, c *model.UpsertInfo) (interface{}, error)
	Read(ctx context.Context, m *[]*model.Tag, s *model.ItemSearch) (int, error)
}

type tag struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *tag) Upsert(ctx context.Context, m *[]*model.Tag, c *model.UpsertInfo) (interface{}, error) {
	ctx, span := otel.Tracer("tag-repository").Start(ctx, "TagRepository Upsert")
	defer span.End()

	var activity = "TagUpsert"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

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

func (a *tag) FromItemsUpsert(ctx context.Context, m *[]model.Tag) (interface{}, error) {
	ctx, span := otel.Tracer("tag-repository").Start(ctx, "TagRepository Upsert")
	defer span.End()

	var activity = "TagUpsert"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	if len(*m) == 0 {
		a.logger.LogInfo(ctx, svcName, activity, "No items to upsert")
		return nil, nil
	}

	// ToDo: Tags should be predefined in the UI so adding new tags via add items would not be possible
	values := a.db.NewValues(m).Column("id", "user_id", "name", "props")
	query := `
		WITH tagliterals (id, user_id, name, props) AS (
			?
		)
		SELECT tl."id", tl."user_id", tl."name", tl."props"
		FROM apps.tags t
			FULL OUTER JOIN tagliterals tl
				ON tl.name = t.name AND tl.user_id = t.user_id
		WHERE t.name IS NULL
	`
	tR := []model.Tag{}
	err := a.db.NewRaw(query, values).Scan(ctx, &tR)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return nil, err
	}

	if len(tR) == 0 {
		a.logger.LogInfo(ctx, svcName, activity, "No new tags to insert ")
		a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
		return nil, nil
	}

	// Add the nonexistent tags
	tq := a.db.NewInsert().Model(&tR).Ignore().
		On("CONFLICT(name, user_id) DO UPDATE").
		Set("props = Excluded.props")
	_, err = tq.Exec(ctx)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return nil, err
	}

	return nil, nil
}

func (a *tag) Read(ctx context.Context, m *[]*model.Tag, s *model.ItemSearch) (int, error) {
	ctx, span := otel.Tracer("tag-repository").Start(ctx, "TagRepository Read")
	defer span.End()

	var activity = "TagRead"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	cte := `
		WITH items AS (
			SELECT
				t."id", t."user_id", t."name", t.props, COALESCE(COUNT(*), 0) count
			FROM apps.items it
				LEFT JOIN LATERAL jsonb_array_elements_text(it.tags::JSONB) AS elem(tag_id)
					ON TRUE
				FULL OUTER JOIN apps.tags t ON t.user_id = it.user_id AND t.id = elem.tag_id
			GROUP BY t."id", t."user_id", t."name"
		)
	`

	query := `
		SELECT it.*
		FROM items it
		WHERE it.user_id::VARCHAR = '` + s.UserId + `'
	`

	if s.SearchQuery != "" {
		n := ` AND ( it.name LIKE '%` + s.SearchQuery + `%' ) `
		query = query + n
	}
	if s.Tags != "" {
		n := ` AND (it.name = ` + s.Tags + ` ) `
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
