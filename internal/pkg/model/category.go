package model

import (
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
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

func (c *Category) CreateOneCategoryModelFromRequest(msg *v1.CategoryServiceCreateOneRequest) {
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

func CreateManyCategoryModelFromRequest(msg *v1.CategoryServiceCreateManyRequest) *Categories {
	c := Categories{}
	for _, value := range msg.Category {
		aCat := new(Category)
		aCat.CreateOneCategoryModelFromRequest(value)
		c = append(c, aCat)
	}
	return &c
}

func (c *Category) ReadOneCategoryModelFromRequest(msg *v1.CategoryServiceCreateOneRequest) {
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

func (c *Category) UpdateOneCategoryModelFromRequest(msg *v1.CategoryServiceUpdateOneRequest, repoModel *Category) {
	c.Id = msg.GetId()
	c.Name = msg.GetName()
	c.Description = msg.GetDescription()
	c.Note = msg.GetNote()
	c.Audit = Audit{
		// CreatedBy: msg.Audit.GetCreatedBy(),
		CreatedBy: repoModel.Audit.CreatedBy,
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		DeletedBy: repoModel.Audit.DeletedBy,
		CreatedAt: repoModel.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(),
		DeletedAt: repoModel.Audit.DeletedAt,
	}

	// Set fields that were not included in the update request.
	if c.Name == "" {
		c.Name = repoModel.Name
	}

	if c.Description == "" {
		c.Description = repoModel.Description
	}

	if c.Note == "" {
		c.Note = repoModel.Note
	}
}

func UpdateManyCategoryModelFromRequest(msgs *v1.CategoryServiceUpdateManyRequest, repoModel *Categories) *Categories {
	categories := Categories{}

	for _, valReq := range msgs.Category {
		for _, valRepo := range *repoModel {
			if valRepo.Id == valReq.Id {
				c := Category{
					Id:          valReq.GetId(),
					Name:        valReq.GetName(),
					Description: valReq.GetDescription(),
					Note:        valReq.GetNote(),
					Audit: Audit{
						CreatedBy: valRepo.Audit.CreatedBy,
						UpdatedBy: valReq.Audit.GetUpdatedBy(),
						DeletedBy: valRepo.Audit.DeletedBy,
						CreatedAt: valRepo.Audit.CreatedAt,
						UpdatedAt: time.Now().UTC(),
						DeletedAt: valRepo.Audit.DeletedAt,
					},
				}

				// Set fields that were not included in the update request.
				if c.Name == "" {
					c.Name = valRepo.Name
				}

				if c.Description == "" {
					c.Description = valRepo.Description
				}

				if c.Note == "" {
					c.Note = valRepo.Note
				}

				categories = append(categories, &c)
			}
		}
	}
	return &categories
}

func (c *Category) DeleteOneCategoryModelFromRequest(msg *v1.CategoryServiceDeleteOneRequest, repoModel *Category) {
	c.Id = repoModel.Id
	c.Name = repoModel.Name
	c.Description = repoModel.Description
	c.Note = repoModel.Note
	c.Audit = Audit{
		CreatedBy: repoModel.Audit.CreatedBy,
		UpdatedBy: msg.Audit.DeletedBy, //Set the updater to who deleted the reocord
		DeletedBy: msg.Audit.DeletedBy,
		CreatedAt: repoModel.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(), //Set the record to recently updated
		DeletedAt: time.Now().UTC(),
	}
}

func DeleteManyCategoryModelFromRequest(msgs *v1.CategoryServiceDeleteManyRequest, repoModel *Categories) *Categories {
	categories := Categories{}

	for _, valReq := range msgs.Category {
		for _, valRepo := range *repoModel {
			if valRepo.Id == valReq.Id {
				c := Category{
					Id:          valReq.GetId(),
					Name:        valRepo.Name,
					Description: valRepo.Description,
					Note:        valRepo.Note,
					Audit: Audit{
						CreatedBy: valRepo.Audit.CreatedBy,
						UpdatedBy: valReq.Audit.GetDeletedBy(),
						DeletedBy: valReq.Audit.GetDeletedBy(),
						CreatedAt: valRepo.Audit.CreatedAt,
						UpdatedAt: time.Now().UTC(),
						DeletedAt: time.Now().UTC(),
					},
				}
				categories = append(categories, &c)
			}
		}
	}
	return &categories
}

func (c *Category) CategoryModelToResponse() *v1.CategoryServiceCreateOneResponse {
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

func (cs *Categories) ManyCategoryModelToResponse() *v1.CategoryServiceCreateManyResponse {
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
