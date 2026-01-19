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
)


type Tag interface {
	Select(ctx context.Context, m interface{}, c *[]model.WhereClause, s string, o int, l int) (int, error)
	SelectItem(ctx context.Context, m interface{}, c *[]model.WhereClause, s string, o int, l int) (int, error)
	Insert(ctx context.Context, m interface{}) error
	Update(ctx context.Context, v interface{}, m interface{}, s []string, w []string, al string) error
	Upsert(ctx context.Context, m interface{}, c *model.UpsertInfo) (interface{}, error)
}

type tag struct {
	db     *bun.DB
	logger *logging.Factory
}


func (a *tag) Select(ctx context.Context, m interface{}, c *[]model.WhereClause, s string, o int, l int) (int, error) {
	ctx, span := otel.Tracer("tag-repository").Start(ctx, "TagRepository Select")
	defer span.End()

	var activity = "TagSelect"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	qb := a.db.NewSelect().Table("apps.items").
		ColumnExpr("jsonb_array_elements_text(?::jsonb) AS tag", bun.Ident("tag")).Where("?::VARCHAR != 'null'", bun.Ident("tag")).
		Distinct().Model(m).QueryBuilder()
	// Add where clause
	for _, k := range *c {
		qb = qb.Where(k.Placeholder, bun.Ident(k.Column), k.Value)
	}
	selectQuery := qb.Unwrap().(*bun.SelectQuery)

	if (s != ""){
		selectQuery = selectQuery.OrderExpr(s)
	}
	if (l != 0){
		selectQuery = selectQuery.Limit(l)
	}
	if (o != 0){
		selectQuery = selectQuery.Offset(o)
	}

	count, err := selectQuery.ScanAndCount(ctx)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return 0, err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return count, nil
}


func (a *tag) SelectItem(ctx context.Context, m interface{}, c *[]model.WhereClause, s string, o int, l int) (int, error) {
	ctx, span := otel.Tracer("tag-repository").Start(ctx, "TagRepository SelectItem")
	defer span.End()

	var activity = "TagSelectItem"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)


	var uid interface{};
	var tgs interface{};
	for _, k := range *c {
		if (k.Column == "user_id"){
			uid = k.Value
		}
		if (k.Column == "tag"){
			tgs = k.Value
		}
	}

	count := 0
	err := a.db.NewRaw(`
			SELECT *
			FROM apps.items a
			WHERE EXISTS (
				SELECT 1
				FROM jsonb_array_elements_text(a.tag::JSONB) AS elem
				WHERE elem IN (?0) AND  a.tag::VARCHAR != 'null'
					AND user_id::VARCHAR = ?1
			);
		`, tgs, uid,
		).Scan(ctx, m)


	// count, err := selectQuery.ScanAndCount(ctx)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return 0, err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return count, nil
}

func (a *tag) Insert(ctx context.Context, m interface{}) error {
	ctx, span := otel.Tracer("tag-repository").Start(ctx, "TagRepository Insert")
	defer span.End()
	var activity = "TagInsert"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	_, err := a.db.NewInsert().Model(m).Returning("*").Exec(ctx)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return nil
}

func (a *tag) Update(ctx context.Context, v interface{},
	m interface{}, s []string, w []string, al string) error {
	ctx, span := otel.Tracer("tag-repository").Start(ctx, "TagRepository Update")
	defer span.End()
	var activity = "TagUpdate"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	values := a.db.NewValues(v)
	q := a.db.NewUpdate().With("_data", values).Model(m).TableExpr("_data")

	for _, v := range s {
		r := fmt.Sprintf("%v = _data.%v", bun.Ident(v), bun.Ident(v))
		q = q.Set(r)
	}

	for _, v := range w {
		r := fmt.Sprintf("%v.%v = _data.%v", al, bun.Ident(v), bun.Ident(v))
		q = q.Where(r)
	}

	_, err := q.Exec(ctx)

	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return nil
}

func (a *tag) Upsert(ctx context.Context, m interface{}, c *model.UpsertInfo) (interface{}, error) {
	ctx, span := otel.Tracer("tag-repository").Start(ctx, "TagRepository Upsert")
	defer span.End()

	var activity = "TagUpsert"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	var conflict string
	if len(c.Conflict) == 0 {
		conflict = fmt.Sprintf("CONFLICT(%v) DO NOTHING",
			strings.Join(c.Conflict, ", "))
	} else {
		conflict = fmt.Sprintf("CONFLICT(%v) DO UPDATE",
			strings.Join(c.Conflict, ", "))
	}

	q := a.db.NewInsert().Model(m).On(conflict)

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
