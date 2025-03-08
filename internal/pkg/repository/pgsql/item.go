package pgsql

import (
	"context"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
	"fmt"
	"strings"
	"cornucopia/listah/internal/pkg/logging"
	"cornucopia/listah/internal/pkg/model"
)

type Item interface {
	Select(ctx context.Context, m interface{}, c *[]model.WhereClause) error
	Insert(ctx context.Context, m interface{}) error
	Upsert(ctx context.Context, m interface{}, c *model.UpsertInfo) error
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
	qb = addWhere(qb, c)
	selectQuery := qb.Unwrap().(*bun.SelectQuery)

	if err:= selectQuery.Scan(ctx); err != nil {
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

func (a *item) Upsert(ctx context.Context, m interface{}, c *model.UpsertInfo) error {
	ctx, span := otel.Tracer("item-repository").Start(ctx, "insert")
	defer span.End()
	a.logger.For(ctx).Info("Inserting into item")

	var conflict string
	if (len(c.Conflict) == 0){
		conflict = fmt.Sprintf("CONFLICT(%v) DO NOTHING",
			strings.Join(c.Conflict, ", "))
	} else {
		conflict = fmt.Sprintf("CONFLICT(%v) DO UPDATE",
			strings.Join(c.Conflict, ", "))
	}

	q := a.db.NewInsert().Model(m).On(conflict)

	for _,v := range c.Resolve{
		r := fmt.Sprintf("%v = Excluded.%v", v, v)
		q = q.Set(r)
	}

	_, err := q.Returning("*").Exec(ctx)
	if err != nil {
		a.logger.For(ctx).Error("Error occurred in repository while inserting into item", zap.String("cause", errors.Cause(err).Error()))
		return err
	}

	return nil
}
