package model

import (
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"go.opentelemetry.io/otel"
	"golang.org/x/net/context"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type Category struct {
	bun.BaseModel `bun:"table:app.categories,alias:u"`
	Id            string `bun:",pk"`
	Name          string
	Description   string
	Note          string
	Audit         Audit
}

type Categories []*Category

func (c *Category) CreateCategoryModelFromRequest(ctx context.Context, msg *v1.CategoryServiceCreateOneRequest) {
	_, span := otel.Tracer("category-model").Start(ctx, "prep create request")
	defer span.End()

	// Update category model
	c.Id = uuid.Must(uuid.NewV7()).String()
	c.Name = msg.GetName()
	c.Description = msg.GetDescription()
	c.Note = msg.GetNote()
	c.Audit = Audit{
		CreatedBy: msg.Audit.GetCreatedBy(),
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		DeletedBy: msg.Audit.GetDeletedBy(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: msg.Audit.GetUpdatedAt().AsTime(),
		DeletedAt: msg.Audit.GetDeletedAt().AsTime(),
	}
}

func CreateManyCategoryModelFromRequest(ctx context.Context, msg *v1.CategoryServiceCreateManyRequest) *Categories {
	_, span := otel.Tracer("category-model").Start(ctx, "prep create many request")
	defer span.End()

	c := Categories{}
	for _, value := range msg.Category {
		aCat := new(Category)
		aCat.CreateCategoryModelFromRequest(ctx, value)
		c = append(c, aCat)
	}
	return &c
}

func (c *Category) ReadCategoryModelFromRequest(ctx context.Context, msg *v1.CategoryServiceCreateOneRequest) {
	_, span := otel.Tracer("category-model").Start(ctx, "prep create request")
	defer span.End()

	// Update category model
	c.Id = uuid.Must(uuid.NewV7()).String()
	c.Name = msg.GetName()
	c.Description = msg.GetDescription()
	c.Note = msg.GetNote()
	c.Audit = Audit{
		CreatedBy: msg.Audit.GetCreatedBy(),
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		DeletedBy: msg.Audit.GetDeletedBy(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: msg.Audit.GetUpdatedAt().AsTime(),
		DeletedAt: msg.Audit.GetDeletedAt().AsTime(),
	}
}

func (c *Category) UpdateCategoryModelFromRequest(ctx context.Context, msg *v1.CategoryServiceUpdateOneRequest, readCategory *Category) {
	_, span := otel.Tracer("category-model").Start(ctx, "prep update request")
	defer span.End()

	c.Id = msg.GetId()
	c.Name = msg.GetName()
	c.Description = msg.GetDescription()
	c.Note = msg.GetNote()
	c.Audit = Audit{
		// CreatedBy: msg.Audit.GetCreatedBy(),
		CreatedBy: readCategory.Audit.CreatedBy,
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		DeletedBy: readCategory.Audit.DeletedBy,
		CreatedAt: readCategory.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(),
		DeletedAt: readCategory.Audit.DeletedAt,
	}

	// Set fields that were not included in the update request.
	if c.Name == "" {
		c.Name = readCategory.Name
	}

	if c.Description == "" {
		c.Description = readCategory.Description
	}

	if c.Note == "" {
		c.Note = readCategory.Note
	}
}

func (c *Category) DeleteCategoryModelFromRequest(ctx context.Context, msg *v1.CategoryServiceDeleteOneRequest, readCategory *Category) {
	_, span := otel.Tracer("category-model").Start(ctx, "prep delete request")
	defer span.End()

	c.Id = readCategory.Id
	c.Name = readCategory.Name
	c.Description = readCategory.Description
	c.Note = readCategory.Note
	c.Audit = Audit{
		CreatedBy: readCategory.Audit.CreatedBy,
		UpdatedBy: msg.Audit.DeletedBy, //Set the updater to who deleted the reocord
		DeletedBy: msg.Audit.DeletedBy,
		CreatedAt: readCategory.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(), //Set the record to recently updated
		DeletedAt: time.Now().UTC(),
	}
}

func (c *Category) CategoryModelToResponse(ctx context.Context) *v1.CategoryServiceCreateOneResponse {
	_, span := otel.Tracer("category-model").Start(ctx, "category model to response")
	defer span.End()
	return &v1.CategoryServiceCreateOneResponse{
		Id:          c.Id,
		Name:        c.Name,
		Description: c.Description,
		Note:        c.Note,
		Audit: &v1.Audit{
			CreatedBy: c.Audit.CreatedBy,
			UpdatedBy: c.Audit.UpdatedBy,
			DeletedBy: c.Audit.DeletedBy,
			UpdatedAt: timestamppb.New(c.Audit.UpdatedAt),
			CreatedAt: timestamppb.New(c.Audit.CreatedAt),
			DeletedAt: timestamppb.New(c.Audit.DeletedAt),
		},
	}
}

func (cs *Categories) ManyCategoryModelToResponse(ctx context.Context) *v1.CategoryServiceCreateManyResponse {
	_, span := otel.Tracer("category-model").Start(ctx, "category model to response")
	defer span.End()

	resValue := &v1.CategoryServiceCreateManyResponse{}
	for _, c := range *cs {
		a := &v1.CategoryServiceCreateOneResponse{
			Id:          c.Id,
			Name:        c.Name,
			Description: c.Description,
			Note:        c.Note,
			Audit: &v1.Audit{
				CreatedBy: c.Audit.CreatedBy,
				UpdatedBy: c.Audit.UpdatedBy,
				DeletedBy: c.Audit.DeletedBy,
				UpdatedAt: timestamppb.New(c.Audit.UpdatedAt),
				CreatedAt: timestamppb.New(c.Audit.CreatedAt),
				DeletedAt: timestamppb.New(c.Audit.DeletedAt),
			},
		}
		resValue.Category = append(resValue.Category, a)
	}
	return resValue
}