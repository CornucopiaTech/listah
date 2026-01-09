package bunpgsql

import (
	"context"
	"cornucopia/listah/internal/pkg/logging"
	"cornucopia/listah/internal/pkg/model"
	"fmt"
	"strings"

	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"go.opentelemetry.io/otel"
)

var svcName string = "PgDB"

type Item interface {
	Select(ctx context.Context, m interface{}, c *[]model.WhereClause, s string, o int, l int) (int, error)
	Count(ctx context.Context, m interface{}, c *[]model.WhereClause, s string, o int, l int) error
	Insert(ctx context.Context, m interface{}) error
	Update(ctx context.Context, v interface{}, m interface{}, s []string, w []string, al string) error
	Upsert(ctx context.Context, m interface{}, c *model.UpsertInfo) (interface{}, error)
}

type item struct {
	db     *bun.DB
	logger *logging.Factory
}


func (a *item) Select(ctx context.Context, m interface{}, c *[]model.WhereClause, s string, o int, l int) (int, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Select")
	defer span.End()

	var activity = "ItemSelect"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	qb := a.db.NewSelect().Model(m).QueryBuilder()
	// Add where clause
	for _, k := range *c {
		qb = qb.Where(k.Placeholder, bun.Ident(k.Column), k.Value)
	}
	selectQuery := qb.Unwrap().(*bun.SelectQuery)

	if (s != ""){
		selectQuery = selectQuery.OrderExpr(s)
	}
	if ( l != 0){
		selectQuery = selectQuery.Limit(l)
	}
	if ( o != 0){
		selectQuery = selectQuery.Offset(o)
	}

	// count, err := selectQuery.OrderExpr(s).Limit(l).Offset(o).ScanAndCount(ctx)
	count, err := selectQuery.ScanAndCount(ctx)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return 0, err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return count, nil
}

func (a *item) Count(ctx context.Context, m interface{}, c *[]model.WhereClause, s string, o int, l int) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Select")
	defer span.End()

	var activity = "ItemSelect"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	qb := a.db.NewSelect().Model(m).QueryBuilder()
	// Add where clause
	// qb = addWhere(qb, c)
	for _, k := range *c {
		qb = qb.Where(k.Placeholder, bun.Ident(k.Column), k.Value)
	}
	selectQuery := qb.Unwrap().(*bun.SelectQuery)

	if err := selectQuery.OrderExpr(s).Limit(l).Offset(o).Scan(ctx); err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return nil
}

func (a *item) Insert(ctx context.Context, m interface{}) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Insert")
	defer span.End()
	var activity = "ItemInsert"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)

	_, err := a.db.NewInsert().Model(m).Returning("*").Exec(ctx)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return nil
}

func (a *item) Update(ctx context.Context, v interface{},
	m interface{}, s []string, w []string, al string) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Update")
	defer span.End()
	var activity = "ItemUpdate"
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

func (a *item) Upsert(ctx context.Context, m interface{}, c *model.UpsertInfo) (interface{}, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "ItemRepository Upsert")
	defer span.End()

	var activity = "ItemUpsert"
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
