package model

import (
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type StoreWrite struct {
	bun.BaseModel `bun:"table:app.stores,alias:s"`
	Id            string `bun:",pk"`
	Name          string
	Description   string
	Note          string
	CategoryId    string
	Audit         Audit
}

type StoreRead struct {
	bun.BaseModel `bun:"table:app.stores,alias:s"`
	Id            string `bun:",pk"`
	Name          string
	Description   string
	Note          string
	CategoryId    string
	CategoryName  string
	Audit         Audit
}

type StoresRead []*StoreRead
type StoresWrite []*StoreWrite

func (c *StoreWrite) CreateOneStoreModelFromRequest(msg *v1.StoreServiceCreateOneRequest) {
	// Update category model
	c.Id = uuid.Must(uuid.NewV7()).String()
	c.Name = msg.GetName()
	c.Description = msg.GetDescription()
	c.Note = msg.GetNote()
	c.CategoryId = msg.CategoryId
	c.Audit = Audit{
		CreatedBy: msg.Audit.GetCreatedBy(),
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		DeletedBy: msg.Audit.GetDeletedBy(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: msg.Audit.GetUpdatedAt().AsTime(),
		DeletedAt: msg.Audit.GetDeletedAt().AsTime(),
	}
}

func CreateManyStoreModelFromRequest(msg *v1.StoreServiceCreateManyRequest) *StoresWrite {
	c := StoresWrite{}
	for _, reqValue := range msg.Store {
		aCat := new(StoreWrite)
		aCat.CreateOneStoreModelFromRequest(reqValue)
		c = append(c, aCat)
	}
	return &c
}

// func (c *StoreRead) ReadOneStoreModelFromRequest(msg *v1.StoreServiceCreateOneRequest, repoModel *Category) {
// 	// Update category model
// 	c.Id = uuid.Must(uuid.NewV7()).String()
// 	c.Name = msg.GetName()
// 	c.Description = msg.GetDescription()
// 	c.Note = msg.GetNote()
// 	c.CategoryId = repoModel.Id
// 	c.Audit = Audit{
// 		CreatedBy: msg.Audit.GetCreatedBy(),
// 		UpdatedBy: msg.Audit.GetUpdatedBy(),
// 		DeletedBy: msg.Audit.GetDeletedBy(),
// 		CreatedAt: time.Now().UTC(),
// 		UpdatedAt: msg.Audit.GetUpdatedAt().AsTime(),
// 		DeletedAt: msg.Audit.GetDeletedAt().AsTime(),
// 	}
// }

func (c *StoreWrite) UpdateOneStoreModelFromRequest(msg *v1.StoreServiceUpdateOneRequest, readModel *StoreRead) {
	c.Id = msg.GetId()
	c.Name = msg.GetName()
	c.Description = msg.GetDescription()
	c.Note = msg.GetNote()
	c.CategoryId = msg.GetCategoryId()
	c.Audit = Audit{
		CreatedBy: readModel.Audit.CreatedBy,
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		DeletedBy: readModel.Audit.DeletedBy,
		CreatedAt: readModel.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(),
		DeletedAt: readModel.Audit.DeletedAt,
	}

	// Set fields that were not included in the update request.
	if c.Name == "" {
		c.Name = readModel.Name
	}

	if c.Description == "" {
		c.Description = readModel.Description
	}

	if c.Note == "" {
		c.Note = readModel.Note
	}

	if c.CategoryId == "" {
		c.CategoryId = readModel.CategoryId
	}
}

func UpdateManyStoreModelFromRequest(msgs *v1.StoreServiceUpdateManyRequest, readModel *StoresRead) *StoresWrite {
	stores := StoresWrite{}

	for _, valReq := range msgs.Store {
		for _, valRepo := range *readModel {
			if valRepo.Id == valReq.Id {
				c := StoreWrite{
					Id:          valReq.GetId(),
					Name:        valReq.GetName(),
					Description: valReq.GetDescription(),
					Note:        valReq.GetNote(),
					CategoryId:  valReq.GetCategoryId(),
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

				if c.CategoryId == "" {
					c.CategoryId = valRepo.CategoryId
				}

				stores = append(stores, &c)
			}
		}
	}
	return &stores
}

func (c *StoreWrite) DeleteOneStoreModelFromRequest(msg *v1.StoreServiceDeleteOneRequest, readModel *StoreRead) {
	c.Id = readModel.Id
	c.Name = readModel.Name
	c.Description = readModel.Description
	c.Note = readModel.Note
	c.CategoryId = readModel.CategoryId
	c.Audit = Audit{
		CreatedBy: readModel.Audit.CreatedBy,
		UpdatedBy: msg.Audit.DeletedBy, //Set the updater to who deleted the reocord
		DeletedBy: msg.Audit.DeletedBy,
		CreatedAt: readModel.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(), //Set the record to recently updated
		DeletedAt: time.Now().UTC(),
	}
}

func DeleteManyStoreModelFromRequest(msgs *v1.StoreServiceDeleteManyRequest, readModel *StoresRead) *StoresWrite {
	stores := StoresWrite{}

	for _, valReq := range msgs.Store {
		for _, valRepo := range *readModel {
			if valRepo.Id == valReq.Id {
				c := StoreWrite{
					Id:          valReq.GetId(),
					Name:        valRepo.Name,
					Description: valRepo.Description,
					Note:        valRepo.Note,
					CategoryId:  valRepo.CategoryId,
					Audit: Audit{
						CreatedBy: valRepo.Audit.CreatedBy,
						UpdatedBy: valReq.Audit.GetDeletedBy(),
						DeletedBy: valReq.Audit.GetDeletedBy(),
						CreatedAt: valRepo.Audit.CreatedAt,
						UpdatedAt: time.Now().UTC(),
						DeletedAt: time.Now().UTC(),
					},
				}
				stores = append(stores, &c)
			}
		}
	}
	return &stores
}

func (c *StoreRead) StoreModelToResponse() *v1.StoreServiceCreateOneResponse {
	return &v1.StoreServiceCreateOneResponse{
		Id:           c.Id,
		Name:         c.Name,
		Description:  c.Description,
		Note:         c.Note,
		CategoryId:   c.CategoryId,
		CategoryName: c.CategoryName,
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

func (cs *StoresRead) ManyStoreModelToResponse() *v1.StoreServiceCreateManyResponse {
	resValue := &v1.StoreServiceCreateManyResponse{}
	for _, c := range *cs {
		a := &v1.StoreServiceCreateOneResponse{
			Id:           c.Id,
			Name:         c.Name,
			Description:  c.Description,
			Note:         c.Note,
			CategoryId:   c.CategoryId,
			CategoryName: c.CategoryName,
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
