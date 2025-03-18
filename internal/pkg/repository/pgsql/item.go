package pgsql

import (
	"context"
	"cornucopia/listah/internal/pkg/logging"
	"cornucopia/listah/internal/pkg/model"
	"fmt"
	"strings"

	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
)

type Item interface {
	Select(ctx context.Context, m interface{}, c *[]model.WhereClause) error
	Insert(ctx context.Context, m interface{}) error
	Update(ctx context.Context, v interface{},
		m interface{}, s []string, w []string, al string) error
	Upsert(ctx context.Context, m interface{}, c *model.UpsertInfo) (interface{}, error)
	BulkUpsert(ctx context.Context, m interface{}, c *model.UpsertInfo) (interface{}, error)
}

type item struct {
	db     *bun.DB
	logger *logging.Factory
}

func (a *item) Select(ctx context.Context, m interface{}, c *[]model.WhereClause) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "select")
	defer span.End()

	a.logger.For(ctx).Info("Selecting from item")
	qb := a.db.NewSelect().Model(m).QueryBuilder()

	// Add where clause
	// qb = addWhere(qb, c)
	for _,k := range *c {
		qb = qb.Where(k.Placeholder, bun.Ident(k.Column), k.Value)
	}
	selectQuery := qb.Unwrap().(*bun.SelectQuery)

	if err := selectQuery.Scan(ctx); err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while selecting from item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}
	return nil
}

func (a *item) Insert(ctx context.Context, m interface{}) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "insert")
	defer span.End()
	a.logger.For(ctx).Info("Inserting into item")

	_, err := a.db.NewInsert().Model(m).Returning("*").Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting into item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *item) Update(ctx context.Context, v interface{},
	m interface{}, s []string, w []string, al string) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "insert")
	defer span.End()
	a.logger.For(ctx).Info("Updating into item")

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
		a.logger.For(ctx).Error("Error occurred in repository while updating item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}

func (a *item) Upsert(ctx context.Context, m interface{}, c *model.UpsertInfo) (interface{}, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "insert")
	defer span.End()
	a.logger.For(ctx).Info("Inserting into item")

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
		a.logger.For(ctx).Error("Error occurred in repository while inserting into item", zap.String("cause", errors.Cause(err).Error()))
		return nil, err
	}

	return res, nil
}

func (a *item) BulkUpsert(ctx context.Context, m interface{}, c *model.UpsertInfo) (interface{}, error) {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "insert")
	defer span.End()
	a.logger.For(ctx).Info("Inserting into item")

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
		r := fmt.Sprintf("%v = Excluded.%v", bun.Ident(v), bun.Ident(v))
		q = q.Set(r)
	}

	res, err := q.Returning("*").Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting into item", zap.String("cause", errors.Cause(err).Error()))
		return nil, err
	}

	return res, nil
}
