package bunpgsql

import (
	"context"
	"cornucopia/listah/apps/api/internal/pkg/logging"
	"cornucopia/listah/apps/api/internal/pkg/model"
	// "fmt"
	// "strings"

	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"go.opentelemetry.io/otel"
)


type Tag interface {
	Select(ctx context.Context, m interface{}, c *[]model.WhereClause, s string, o int, l int) (int, error)
	SelectItem(ctx context.Context, m interface{}, c *[]model.WhereClause, s string, o int, l int) (int, error)
	SelectGroup(ctx context.Context, m interface{}, c *[]model.WhereClause, s string, o int, l int) (int, error)
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

func (a *tag) SelectItemPrev(ctx context.Context, m interface{}, c *[]model.WhereClause, s string, o int, l int) (int, error) {
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

func (a *tag) SelectGroup(ctx context.Context, m interface{}, c *[]model.WhereClause, s string, o int, l int) (int, error) {
	ctx, span := otel.Tracer("tag-repository").Start(ctx, "TagRepository SelectGroup")
	defer span.End()

	var activity = "TagSelectGroup"
	a.logger.LogInfo(ctx, svcName, activity, "Begin "+activity)


	var uid interface{};
	for _, k := range *c {
		if (k.Column == "user_id"){
			uid = k.Value
		}
	}

	count := 0
	err := a.db.NewRaw(`
		SELECT tag, COUNT(*) AS row_count
		FROM (
			SELECT DISTINCT id, JSONB_ARRAY_ELEMENTS_TEXT(tag::JSONB) AS tag
			FROM apps.items
			WHERE tag::VARCHAR != 'null' AND user_id::VARCHAR = ?0
		)
		GROUP BY 1
		ORDER BY 1
	`, uid).Scan(ctx, m)


	// count, err := selectQuery.ScanAndCount(ctx)
	if err != nil {
		a.logger.LogError(ctx, svcName, activity, "Error occurred", errors.Cause(err).Error())
		return 0, err
	}

	a.logger.LogInfo(ctx, svcName, activity, "End "+activity)
	return count, nil
}
