package model

import (
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type ItemWrite struct {
	bun.BaseModel `bun:"table:app.items,alias:i"`
	Id            string `bun:",pk"`
	Title         string
	Description   string
	Note          string
	Tags          []string
	Properties    map[string]string
	ReactivateAt  time.Time
	Audit         Audit
}

type ItemRead struct {
	bun.BaseModel `bun:"table:app.items,alias:i"`
	Id            string `bun:",pk"`
	Title         string
	Description   string
	Note          string
	Tags          []string
	Properties    map[string]string
	ReactivateAt  time.Time
	Audit         Audit
}

type ItemsRead []*ItemRead
type ItemsWrite []*ItemWrite

func (c *ItemWrite) CreateOneItemModelFromRequest(msg *v1.ItemServiceCreateOneRequest) {
	// Update category model
	c.Id = uuid.Must(uuid.NewV7()).String()
	c.Title = msg.GetTitle()
	c.Description = msg.GetDescription()
	c.Note = msg.GetNote()
	c.Tags = msg.GetTags()
	c.Properties = msg.GetProperties()
	c.ReactivateAt = msg.GetReactivateAt().AsTime()
	c.Audit = Audit{
		CreatedBy: msg.Audit.GetCreatedBy(),
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		DeletedBy: msg.Audit.GetDeletedBy(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: msg.Audit.GetUpdatedAt().AsTime(),
		DeletedAt: msg.Audit.GetDeletedAt().AsTime(),
	}
}

func CreateManyItemModelFromRequest(msg *v1.ItemServiceCreateManyRequest) *ItemsWrite {
	c := ItemsWrite{}
	for _, reqValue := range msg.Item {
		aCat := new(ItemWrite)
		aCat.CreateOneItemModelFromRequest(reqValue)
		c = append(c, aCat)
	}
	return &c
}

func (c *ItemWrite) UpdateOneItemModelFromRequest(msg *v1.ItemServiceUpdateOneRequest, readModel *ItemRead) {
	c.Id = msg.GetId()
	c.Title = msg.GetTitle()
	c.Description = msg.GetDescription()
	c.Note = msg.GetNote()
	c.Tags = msg.GetTags()
	c.Properties = msg.GetProperties()
	c.ReactivateAt = msg.GetReactivateAt().AsTime()
	c.Audit = Audit{
		CreatedBy: readModel.Audit.CreatedBy,
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		DeletedBy: readModel.Audit.DeletedBy,
		CreatedAt: readModel.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(),
		DeletedAt: readModel.Audit.DeletedAt,
	}

	// Set fields that were not included in the update request.
	if c.Title == "" {
		c.Title = readModel.Title
	}

	if c.Description == "" {
		c.Description = readModel.Description
	}

	if c.Note == "" {
		c.Note = readModel.Note
	}

	if len(c.Tags) == 0 {
		c.Tags = readModel.Tags
	}

	if len(c.Properties) == 0 {
		c.Properties = readModel.Properties
	}

	if c.ReactivateAt.String() == "" {
		c.ReactivateAt = readModel.ReactivateAt
	}
}

func UpdateManyItemModelFromRequest(msgs *v1.ItemServiceUpdateManyRequest, readModel *ItemsRead) *ItemsWrite {
	items := ItemsWrite{}

	for _, valReq := range msgs.Item {
		for _, valRepo := range *readModel {
			if valRepo.Id == valReq.Id {
				c := ItemWrite{
					Id:           valReq.GetId(),
					Title:        valReq.GetTitle(),
					Description:  valReq.GetDescription(),
					Note:         valReq.GetNote(),
					Tags:         valReq.GetTags(),
					Properties:   valReq.GetProperties(),
					ReactivateAt: valReq.GetReactivateAt().AsTime(),
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
				if c.Title == "" {
					c.Title = valRepo.Title
				}

				if c.Description == "" {
					c.Description = valRepo.Description
				}

				if c.Note == "" {
					c.Note = valRepo.Note
				}

				if len(c.Tags) == 0 {
					c.Tags = valRepo.Tags
				}

				if len(c.Properties) == 0 {
					c.Properties = valRepo.Properties
				}

				if c.ReactivateAt.String() == "" {
					c.ReactivateAt = valRepo.ReactivateAt
				}
				items = append(items, &c)
			}
		}
	}
	return &items
}

func (c *ItemWrite) DeleteOneItemModelFromRequest(msg *v1.ItemServiceDeleteOneRequest, readModel *ItemRead) {
	c.Id = readModel.Id
	c.Title = readModel.Title
	c.Description = readModel.Description
	c.Note = readModel.Note
	c.Tags = readModel.Tags
	c.Properties = readModel.Properties
	c.ReactivateAt = readModel.ReactivateAt
	c.Audit = Audit{
		CreatedBy: readModel.Audit.CreatedBy,
		UpdatedBy: msg.Audit.DeletedBy, //Set the updater to who deleted the reocord
		DeletedBy: msg.Audit.DeletedBy,
		CreatedAt: readModel.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(), //Set the record to recently updated
		DeletedAt: time.Now().UTC(),
	}
}

func DeleteManyItemModelFromRequest(msgs *v1.ItemServiceDeleteManyRequest, readModel *ItemsRead) *ItemsWrite {
	items := ItemsWrite{}

	for _, valReq := range msgs.Item {
		for _, valRepo := range *readModel {
			if valRepo.Id == valReq.Id {
				c := ItemWrite{
					Id:           valReq.GetId(),
					Title:        valRepo.Title,
					Description:  valRepo.Description,
					Note:         valRepo.Note,
					Tags:         valRepo.Tags,
					Properties:   valRepo.Properties,
					ReactivateAt: valRepo.ReactivateAt,
					Audit: Audit{
						CreatedBy: valRepo.Audit.CreatedBy,
						UpdatedBy: valReq.Audit.GetDeletedBy(),
						DeletedBy: valReq.Audit.GetDeletedBy(),
						CreatedAt: valRepo.Audit.CreatedAt,
						UpdatedAt: time.Now().UTC(),
						DeletedAt: time.Now().UTC(),
					},
				}
				items = append(items, &c)
			}
		}
	}
	return &items
}

func (c *ItemRead) ItemModelToResponse() *v1.ItemServiceCreateOneResponse {
	return &v1.ItemServiceCreateOneResponse{
		Id:           c.Id,
		Title:        c.Title,
		Description:  c.Description,
		Note:         c.Note,
		Tags:         c.Tags,
		Properties:   c.Properties,
		ReactivateAt: timestamppb.New(c.ReactivateAt),
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

func (cs *ItemsRead) ManyItemModelToResponse() *v1.ItemServiceCreateManyResponse {
	resValue := &v1.ItemServiceCreateManyResponse{}
	for _, c := range *cs {
		a := &v1.ItemServiceCreateOneResponse{
			Id:           c.Id,
			Title:        c.Title,
			Description:  c.Description,
			Note:         c.Note,
			Tags:         c.Tags,
			Properties:   c.Properties,
			ReactivateAt: timestamppb.New(c.ReactivateAt),
			Audit: &v1.Audit{
				CreatedBy: c.Audit.CreatedBy,
				UpdatedBy: c.Audit.UpdatedBy,
				DeletedBy: c.Audit.DeletedBy,
				UpdatedAt: timestamppb.New(c.Audit.UpdatedAt),
				CreatedAt: timestamppb.New(c.Audit.CreatedAt),
				DeletedAt: timestamppb.New(c.Audit.DeletedAt),
			},
		}
		resValue.Item = append(resValue.Item, a)
	}
	return resValue
}
