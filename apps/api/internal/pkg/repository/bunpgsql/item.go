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
	ReadItem(ctx context.Context, m *[]*v1model.Item, s *model.ItemSearch) error
	ReadCategory(ctx context.Context, m *[]*v1model.Category, s *model.ItemSearch) error
	Upsert(ctx context.Context, m interface{}, c *model.UpsertInfo) (interface{}, error)
}

type item struct {
	db     *bun.DB
	logger *logging.Factory
}


func (a *item) ReadItem(ctx context.Context, m *[]*v1model.Item, s *model.ItemSearch) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Read")
	defer span.End()

	var activity = "ItemRead"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	query := fmt.Sprintf(`
		SELECT
			"id", "user_id", "title", "description",
			"note", "tag", "soft_delete", "reactivate_at"
		FROM apps.items
		WHERE user_id::VARCHAR = '%v'
	`, s.UserId)

	if s.SearchQuery != "" {
		query = query + fmt.Sprintf(`
			AND (
				title LIKE '%%v%' OR
				description LIKE %%v%' OR
				note LIKE %%v%'
			)
		`, s.SearchQuery)
	}
	if s.Filter != "" {
		query = query + fmt.Sprintf(` AND (
			tag::VARCHAR != 'null' AND tag::JSONB ?| array[%v]
		) `, s.Filter)
	}
	if s.SortQuery != "" {
		query = query + fmt.Sprintf(` ORDER BY %v `, s.SortQuery)
	}
	if s.Limit != 0 {
		query = query + fmt.Sprintf(` LIMIT %d `, s.Limit)
	}
	if s.Offset != 0 {
		query = query + fmt.Sprintf(` OFFSET %d `, s.Offset)
	}
	err := a.db.
		NewRaw(query).
		Scan(ctx, m)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return nil
}

func (a *item) ReadCategory(ctx context.Context, m *[]*v1model.Category, s *model.ItemSearch) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Read")
	defer span.End()

	var activity = "ItemCategory"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	query := fmt.Sprintf(`
		SELECT category, COUNT(*) AS row_count
		FROM (
			SELECT DISTINCT id, jsonb_array_elements_text(tag::JSONB) AS category
			FROM apps.items
			WHERE tag::VARCHAR != 'null' AND user_id::VARCHAR = '%v'
		) AS expanded
		GROUP BY 1
		ORDER BY 1
	`, s.UserId)

	if s.Limit != 0 {
		query = query + fmt.Sprintf(` LIMIT %d `, s.Limit)
	}
	if s.Offset != 0 {
		query = query + fmt.Sprintf(` OFFSET %d `, s.Offset)
	}
	err := a.db.
		NewRaw(query).
		Scan(ctx, m)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return nil
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
