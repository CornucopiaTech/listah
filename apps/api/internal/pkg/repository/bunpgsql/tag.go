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
	Read(ctx context.Context, m *[]*model.Tag, s *model.RepoSearch) (int, error)
	ReadProperty(ctx context.Context, m *[]model.TagPropertyMapModel, s *model.RepoSearch) (int, error)
	ReadIdProperty(ctx context.Context, m *[]model.TagPropertyMapModel, s *model.RepoSearch) error
}

type tag struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *tag) Read(ctx context.Context, m *[]*model.Tag, s *model.RepoSearch) (int, error) {
	ctx, span := otel.Tracer("tag-repository").Start(ctx, "TagRepository Read")
	defer span.End()

	var activity = "TagRead"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	cte := `
		WITH items AS (
			SELECT *
			FROM apps.items it
				LEFT JOIN LATERAL JSONB_ARRAY_ELEMENTS_TEXT(it.tags::JSONB) AS elem(tag_id)
					ON TRUE
			WHERE it.user_id::VARCHAR = '` + s.UserId + `'
		)
	`

	query := `
		SELECT t."id", t."user_id", t."name", t.props::VARCHAR props
			,SUM(CASE WHEN it.id IS NOT NULL THEN 1 ELSE 0 END) count
		FROM apps.tags t LEFT JOIN items it
			ON t.user_id = it.user_id AND t.id = it.tag_id
		WHERE t.user_id::VARCHAR = '` + s.UserId + `'
			AND (t.soft_delete = false OR t.soft_delete IS NULL)
		GROUP BY 1, 2, 3, 4
	`

	if s.Text != "" {
		n := ` AND ( it.name LIKE '%` + s.Text + `%' ) `
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

	if s.Sort != "" {
		query = query + fmt.Sprintf(` ORDER BY %v `, s.Sort)
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

func (a *tag) ReadProperty(ctx context.Context, m *[]model.TagPropertyMapModel, s *model.RepoSearch) (int, error) {
	ctx, span := otel.Tracer("tag-repository").Start(ctx, "TagRepository ReadProperty")
	defer span.End()

	var activity = "TagReadProperty"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	cte := `
		WITH a AS (
			SELECT DISTINCT REPLACE(propName::VARCHAR, '"', '') "name", tg.id
			FROM apps.tags tg
				CROSS JOIN LATERAL jsonb_array_elements(tg.props::JSONB) AS prop_arr(propName)
			WHERE tg.props IS NOT NULL AND tg.user_id::VARCHAR = '` + s.UserId + `'
		),
		b AS (SELECT a.name, JSON_AGG(DISTINCT a.id) tags FROM a  GROUP BY 1)
	`

	query := `SELECT jsonb_build_object(b.name, b.tags) props FROM b`

	countq := cte + `
		SELECT COUNT(*) row_count
		FROM (` + query + `)`
	recCnt := []*model.RowCount{}
	err := a.db.NewRaw(countq).Scan(ctx, &recCnt)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred while getting total population", errors.Cause(err).Error())
		return 0, err
	}

	err = a.db.NewRaw(cte+query).Scan(ctx, m)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return 0, err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return recCnt[0].RowCount, nil
}

func (a *tag) ReadIdProperty(ctx context.Context, m *[]model.TagPropertyMapModel, s *model.RepoSearch) error {
	ctx, span := otel.Tracer("tag-repository").Start(ctx, "TagRepository ReadIdProperty")
	defer span.End()

	var activity = "TagReadProperty"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	cte := `
		WITH a AS (
			SELECT DISTINCT REPLACE(propName::VARCHAR, '"', '') propName, tg.id
			FROM apps.tags tg
				CROSS JOIN LATERAL JSONB_ARRAY_ELEMENTS(tg.props::JSONB) AS prop_arr(propName)
			WHERE tg.props IS NOT NULL AND tg.user_id::VARCHAR = '` + s.UserId + `'
		),
		b AS (
			SELECT
				a.id,
				--JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('value', a.propName)) props
				JSON_AGG(DISTINCT a.propName) props
			FROM a
			GROUP BY 1
		)
	`

	query := ` SELECT JSONB_BUILD_OBJECT(b.id, b.props) props FROM b `

	err := a.db.NewRaw(cte+query).Scan(ctx, m)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return nil
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
		if strings.Contains(err.Error(), "unique_violation") || strings.Contains(err.Error(), "23505") {
			// Return our safe sentinel error instead of the raw DB trace
			return nil, model.DuplicateName
		}
		return nil, err
	}
	a.logger.LogInfo(ctx, svcName, activity, "Item successfully updated")
	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return nil, nil
}
