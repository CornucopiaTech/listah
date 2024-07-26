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

type SubCategory struct {
	bun.BaseModel `bun:"table:app.categories,alias:u"`
	Id            string `bun:",pk"`
	Name          string
	Description   string
	Note          string
	CategoryId    string
	Audit         Audit
}

func (s *SubCategory) CreateSubCategoryModelFromRequest(ctx context.Context, msg *v1.SubCategoryServiceCreateRequest) {
	_, span := otel.Tracer("category-model").Start(ctx, "prep create request")
	defer span.End()

	// Update category model
	s.Id = uuid.Must(uuid.NewV7()).String()
	s.Name = msg.GetName()
	s.Description = msg.GetDescription()
	s.Note = msg.GetNote()
	s.Audit = Audit{
		CreatedBy: msg.Audit.GetCreatedBy(),
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		DeletedBy: msg.Audit.GetDeletedBy(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: msg.Audit.GetUpdatedAt().AsTime(),
		DeletedAt: msg.Audit.GetDeletedAt().AsTime(),
	}
}

func (s *SubCategory) UpdateSubCategoryModelFromRequest(ctx context.Context, msg *v1.SubCategoryServiceUpdateRequest, readSubCategory *SubCategory) {
	_, span := otel.Tracer("category-model").Start(ctx, "prep update request")
	defer span.End()

	s.Id = msg.GetId()
	s.Name = msg.GetName()
	s.Description = msg.GetDescription()
	s.Note = msg.GetNote()
	s.Audit = Audit{
		// CreatedBy: msg.Audit.GetCreatedBy(),
		CreatedBy: readSubCategory.Audit.CreatedBy,
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		DeletedBy: readSubCategory.Audit.DeletedBy,
		CreatedAt: readSubCategory.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(),
		DeletedAt: readSubCategory.Audit.DeletedAt,
	}

	// Set fields that were not included in the update request.
	if s.Name == "" {
		s.Name = readSubCategory.Name
	}

	if s.Description == "" {
		s.Description = readSubCategory.Description
	}

	if s.Note == "" {
		s.Note = readSubCategory.Note
	}
}

func (s *SubCategory) DeleteSubCategoryModelFromRequest(ctx context.Context, msg *v1.SubCategoryServiceDeleteRequest, readSubCategory *SubCategory) {
	_, span := otel.Tracer("category-model").Start(ctx, "prep delete request")
	defer span.End()

	s.Id = readSubCategory.Id
	s.Name = readSubCategory.Name
	s.Description = readSubCategory.Description
	s.Note = readSubCategory.Note
	s.Audit = Audit{
		CreatedBy: readSubCategory.Audit.CreatedBy,
		UpdatedBy: msg.Audit.DeletedBy, //Set the updater to who deleted the reocord
		DeletedBy: msg.Audit.DeletedBy,
		CreatedAt: readSubCategory.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(), //Set the record to recently updated
		DeletedAt: time.Now().UTC(),
	}
}

func (s *SubCategory) SubCategoryModelToResponse(ctx context.Context) *v1.SubCategoryServiceCreateResponse {
	_, span := otel.Tracer("category-model").Start(ctx, "category model to response")
	defer span.End()
	return &v1.SubCategoryServiceCreateResponse{
		Id:          s.Id,
		Name:        s.Name,
		Description: s.Description,
		Note:        s.Note,
		Audit: &v1.Audit{
			CreatedBy: s.Audit.CreatedBy,
			UpdatedBy: s.Audit.UpdatedBy,
			DeletedBy: s.Audit.DeletedBy,
			UpdatedAt: timestamppb.New(s.Audit.UpdatedAt),
			CreatedAt: timestamppb.New(s.Audit.CreatedAt),
			DeletedAt: timestamppb.New(s.Audit.DeletedAt),
		},
	}
}
