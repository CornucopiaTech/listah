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

type Store struct {
	bun.BaseModel `bun:"table:app.categories,alias:u"`
	Id            string `bun:",pk"`
	Name          string
	Description   string
	Note          string
	Audit         Audit
}

type Stores []*Store

func (c *Store) CreateStoreModelFromRequest(ctx context.Context, msg *v1.StoreServiceCreateOneRequest) {
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

func CreateManyStoreModelFromRequest(ctx context.Context, msg *v1.StoreServiceCreateManyRequest) *Stores {
	_, span := otel.Tracer("category-model").Start(ctx, "prep create many request")
	defer span.End()

	c := Stores{}
	for _, value := range msg.Store {
		aCat := new(Store)
		aCat.CreateStoreModelFromRequest(ctx, value)
		c = append(c, aCat)
	}
	return &c
}

func (c *Store) UpdateStoreModelFromRequest(ctx context.Context, msg *v1.StoreServiceUpdateOneRequest, readStore *Store) {
	_, span := otel.Tracer("category-model").Start(ctx, "prep update request")
	defer span.End()

	c.Id = msg.GetId()
	c.Name = msg.GetName()
	c.Description = msg.GetDescription()
	c.Note = msg.GetNote()
	c.Audit = Audit{
		// CreatedBy: msg.Audit.GetCreatedBy(),
		CreatedBy: readStore.Audit.CreatedBy,
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		DeletedBy: readStore.Audit.DeletedBy,
		CreatedAt: readStore.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(),
		DeletedAt: readStore.Audit.DeletedAt,
	}

	// Set fields that were not included in the update request.
	if c.Name == "" {
		c.Name = readStore.Name
	}

	if c.Description == "" {
		c.Description = readStore.Description
	}

	if c.Note == "" {
		c.Note = readStore.Note
	}
}

func (c *Store) DeleteStoreModelFromRequest(ctx context.Context, msg *v1.StoreServiceDeleteOneRequest, readStore *Store) {
	_, span := otel.Tracer("category-model").Start(ctx, "prep delete request")
	defer span.End()

	c.Id = readStore.Id
	c.Name = readStore.Name
	c.Description = readStore.Description
	c.Note = readStore.Note
	c.Audit = Audit{
		CreatedBy: readStore.Audit.CreatedBy,
		UpdatedBy: msg.Audit.DeletedBy, //Set the updater to who deleted the reocord
		DeletedBy: msg.Audit.DeletedBy,
		CreatedAt: readStore.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(), //Set the record to recently updated
		DeletedAt: time.Now().UTC(),
	}
}

func (c *Store) StoreModelToResponse(ctx context.Context) *v1.StoreServiceCreateOneResponse {
	_, span := otel.Tracer("category-model").Start(ctx, "category model to response")
	defer span.End()
	return &v1.StoreServiceCreateOneResponse{
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

func (cs *Stores) ManyStoreModelToResponse(ctx context.Context) *v1.StoreServiceCreateManyResponse {
	_, span := otel.Tracer("category-model").Start(ctx, "category model to response")
	defer span.End()

	resValue := &v1.StoreServiceCreateManyResponse{}
	for _, c := range *cs {
		a := &v1.StoreServiceCreateOneResponse{
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
		resValue.Store = append(resValue.Store, a)
	}
	return resValue
}
