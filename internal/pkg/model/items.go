package model

import (
	pb "cornucopia/listah/internal/pkg/proto/listah/v1"
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"go.opentelemetry.io/otel"
	"golang.org/x/net/context"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type Item struct {
	bun.BaseModel `bun:"table:app.items,alias:i"`
	Id            string `bun:",pk"`
	Name          string
	Description   string
	Quantity      string
	Note          string
	CategoryId    []string
	ReactivateAt  time.Time
	Audit         Audit
}

func (i *Item) CreateItemModelFromRequest(ctx context.Context, msg *pb.ItemServiceCreateRequest) {
	_, span := otel.Tracer("item-model").Start(ctx, "prep create request")
	defer span.End()

	// Update item model
	i.Id = uuid.Must(uuid.NewV7()).String()
	i.Name = msg.GetName()
	i.Description = msg.GetDescription()
	i.Quantity = msg.GetQuantity()
	i.Note = msg.GetNote()
	i.CategoryId = msg.GetCategoryId()
	i.ReactivateAt = msg.GetReactivateAt().AsTime()
	i.Audit = Audit{
		CreatedBy: msg.Audit.GetCreatedBy(),
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		DeletedBy: msg.Audit.GetDeletedBy(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: msg.Audit.GetUpdatedAt().AsTime(),
		DeletedAt: msg.Audit.GetDeletedAt().AsTime(),
	}
}

func (i *Item) UpdateItemModelFromRequest(ctx context.Context, msg *pb.ItemServiceUpdateRequest, readItem *Item) {
	_, span := otel.Tracer("item-model").Start(ctx, "prep update request")
	defer span.End()

	i.Id = msg.GetId()
	i.Name = msg.GetName()
	i.Description = msg.GetDescription()
	i.Quantity = msg.GetQuantity()
	i.Note = msg.GetNote()
	i.CategoryId = msg.GetCategoryId()
	i.ReactivateAt = msg.GetReactivateAt().AsTime()
	i.Audit = Audit{
		CreatedBy: readItem.Audit.CreatedBy,
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		DeletedBy: readItem.Audit.DeletedBy,
		CreatedAt: readItem.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(),
		DeletedAt: readItem.Audit.DeletedAt,
	}

	// Set fields that were not included in the update request.
	if i.Name == "" {
		i.Name = readItem.Name
	}

	if i.Description == "" {
		i.Description = readItem.Description
	}

	if i.Quantity == "" {
		i.Quantity = readItem.Quantity
	}

	if i.Note == "" {
		i.Note = readItem.Note
	}

	if i.CategoryId == nil {
		i.CategoryId = readItem.CategoryId
	}

	if i.ReactivateAt.IsZero() {
		i.ReactivateAt = readItem.ReactivateAt
	}

}

func (i *Item) DeleteItemModelFromRequest(ctx context.Context, msg *pb.ItemServiceDeleteRequest, readItem *Item) {
	_, span := otel.Tracer("item-model").Start(ctx, "prep delete request")
	defer span.End()

	i.Id = readItem.Id
	i.Name = readItem.Name
	i.Description = readItem.Description
	i.Quantity = readItem.Quantity
	i.Note = readItem.Note
	i.CategoryId = readItem.CategoryId
	i.ReactivateAt = readItem.ReactivateAt
	i.Audit = Audit{

		CreatedBy: readItem.Audit.CreatedBy,
		UpdatedBy: msg.Audit.DeletedBy, //Set the updater to whomever is deleting the reocord
		DeletedBy: msg.Audit.DeletedBy,
		CreatedAt: readItem.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(), //Set the record to recently updated
		DeletedAt: time.Now().UTC(),
	}
}

func (i *Item) ItemModelToResponse(ctx context.Context) *pb.ItemServiceCreateResponse {
	_, span := otel.Tracer("item-model").Start(ctx, "item model to response")
	defer span.End()
	return &pb.ItemServiceCreateResponse{
		Id:           i.Id,
		Name:         i.Name,
		Description:  i.Description,
		Quantity:     i.Quantity,
		Note:         i.Note,
		CategoryId:   i.CategoryId,
		ReactivateAt: timestamppb.New(i.ReactivateAt),
		Audit: &pb.Audit{
			CreatedBy: i.Audit.CreatedBy,
			UpdatedBy: i.Audit.UpdatedBy,
			DeletedBy: i.Audit.DeletedBy,
			UpdatedAt: timestamppb.New(i.Audit.UpdatedAt),
			CreatedAt: timestamppb.New(i.Audit.CreatedAt),
			DeletedAt: timestamppb.New(i.Audit.DeletedAt),
		},
	}
}
