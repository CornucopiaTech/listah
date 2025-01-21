package model

import (
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"time"
	// "fmt"

	"github.com/google/uuid"
	"go.uber.org/zap/zapcore"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type Item struct {
	Id           string `bson:"_id"`
	UserId string
	Summary        string
	Category string
	Description  string
	Note         string
	Tags         []string
	Properties   map[string]string
	ReactivateAt time.Time
	Audit        Audit
}
type Items []*Item

func (i *Item) MarshalLogObject(enc zapcore.ObjectEncoder) error {
	enc.AddString("id", i.Id)
	return nil
}

func (i *Items) MarshalLogObject(enc zapcore.ObjectEncoder) error {
	for _, val := range *i {
		enc.AddString("id", val.Id)
	}
	return nil
}

func (c *Item) CreateOneItemModelFromRequest(msg *v1.ItemServiceCreateOneRequest) {
	// Update category model
	c.Id = uuid.Must(uuid.NewV7()).String()
	c.UserId = msg.GetUserId()
	c.Summary = msg.GetSummary()
	c.Category = msg.GetCategory()
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

func CreateManyItemModelFromRequest(msg *v1.ItemServiceCreateManyRequest) *Items {
	c := Items{}
	for _, reqValue := range msg.Items {
		aCat := new(Item)
		aCat.CreateOneItemModelFromRequest(reqValue)
		c = append(c, aCat)
	}
	return &c
}

func CreateManyItemModelInterfacesFromRequest(msg *v1.ItemServiceCreateManyRequest) *[]interface{} {
	var c []interface{}
	for _, reqValue := range msg.Items {
		aCat := new(Item)
		aCat.CreateOneItemModelFromRequest(reqValue)
		c = append(c, aCat)
		// fmt.Print("\n\nIn CreateManyItemModelFromRequest: ")
		// fmt.Print(aCat)
	}
	return &c
}

func (c *Item) UpdateOneItemModelFromRequest(msg *v1.ItemServiceUpdateOneRequest, readModel *Item) error {
	c.Id = msg.GetId()
	c.UserId = msg.GetUserId()
	c.Summary = msg.GetSummary()
	c.Category = msg.GetCategory()
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
	if c.Summary == "" {
		c.Summary = readModel.Summary
	}

	if c.Category == "" {
		c.Category = readModel.Category
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
	return nil
}

func UpdateManyItemModelFromRequest(msgs *v1.ItemServiceUpdateManyRequest, readModel *Items) (*Items, error) {
	items := Items{}

	for _, valReq := range msgs.Items {
		for _, valRepo := range *readModel {
			if valRepo.Id == valReq.Id {
				c := Item{
					Id:           valRepo.Id,
					UserId:        valReq.GetUserId(),
					Summary:        valReq.GetSummary(),
					Category:        valReq.GetCategory(),
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
				if c.UserId == "" {
					c.UserId = valRepo.UserId
				}

				// Set fields that were not included in the update request.
				if c.Summary == "" {
					c.Summary = valRepo.Summary
				}

				// Set fields that were not included in the update request.
				if c.Category == "" {
					c.Category = valRepo.Category
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
	return &items, nil
}

func (c *Item) DeleteOneItemModelFromRequest(msg *v1.ItemServiceDeleteOneRequest, readModel *Item) {
	c.Id = readModel.Id
	c.UserId = readModel.UserId
	c.Summary = readModel.Summary
	c.Category = readModel.Category
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

func DeleteManyItemModelFromRequest(msgs *v1.ItemServiceDeleteManyRequest, readModel *Items) *Items {
	items := Items{}

	for _, valReq := range msgs.Items {
		for _, valRepo := range *readModel {
			if valRepo.Id == valReq.Id {
				c := Item{
					Id:           valRepo.Id,
					UserId:           valRepo.UserId,
					Summary:        valRepo.Summary,
					Category:        valRepo.Category,
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

func (c *Item) ItemModelToResponse() *v1.ItemServiceCreateOneResponse {
	return &v1.ItemServiceCreateOneResponse{
		Id:           c.Id,
		UserId:           c.UserId,
		Summary:        c.Summary,
		Category:        c.Category,
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

func (cs *Items) ManyItemModelToResponse() *v1.ItemServiceCreateManyResponse {
	resValue := &v1.ItemServiceCreateManyResponse{}
	for _, c := range *cs {
		a := &v1.ItemServiceCreateOneResponse{
			Id:           c.Id,
			UserId:           c.UserId,
			Summary:        c.Summary,
			Category:        c.Category,
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
		resValue.Items = append(resValue.Items, a)
	}
	return resValue
}

func GetReadFilterObject(msg *v1.ItemServiceReadFilterRequest) *map[string] any {
	userInFilter := make(InFilterStringType)
	userInFilter["$in"] = msg.UserFilter


	// tagInFilter := make(InFilterStringType)
	// tagInFilter["$in"] = req.Msg.TagFilter
	tagFilter := make(PostInFilterStringType)
	tagFilter["tags"] = make(InFilterStringType)
	tagFilter["tags"]["$in"] = msg.TagFilter


	// categoryInFilter := make(InFilterStringType)
	// categoryInFilter["$in"] = msg.CategoryFilter
	categoryFilter := make(PostInFilterStringType)
	categoryFilter["category"] = make(InFilterStringType)
	categoryFilter["category"]["$in"] = msg.CategoryFilter


	orFilter := []PostInFilterStringType{tagFilter, categoryFilter}

	readFilter := map[string] any {
		"userid": userInFilter,
		"$or": orFilter,
	}
	return &readFilter
}
