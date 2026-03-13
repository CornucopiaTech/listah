package v1

import (
	// "cornucopia/listah/internal/pkg/model"
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"time"
	// "strings"
	// "fmt"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"google.golang.org/protobuf/types/known/timestamppb"
	// "go.mongodb.org/mongo-driver/v2/bson"
)

type Item struct {
	ReactivateAt time.Time
	UpdatedBy    string
	Properties   map[string]string
	Id           string `bson:"_id"`
	UserId       string
	Title        string
	UpdatedAt    time.Time
	Tags         []string
}

type ItemUpsert struct {
	Filter map[string] string
	// Filter map[string] []map[string] string
	Update map[string] map[string] interface{}
}

type ItemUpdate struct {
	Filter map[string] string
	Update map[string] map[string] interface{}
}

type ItemReplace struct {
	Filter map[string] string
	Replace map[string] interface{}
}

type ItemRead struct {
	Filter map[string] interface{}
}


func InsertItemQueryFromRequest(msg *pb.ItemServiceUpsertItemRequest) ([]*Item, error) {
	c := []*Item{}
	for _, om := range msg.Items {
		if om.GetUserId() == "" {
			return nil, errors.New("no userId sent with request")
		}
		id := om.GetId()
		if id == "" {
			id = uuid.Must(uuid.NewV7()).String()
		}
		a := &Item{
			Id:           id,
			UserId:       om.GetUserId(),
			Title:        om.GetTitle(),
			Tags:         om.GetTags(),
			Properties:   om.GetProperties(),
			ReactivateAt: om.GetReactivateAt().AsTime(),
		}
		c = append(c, a)
	}
	return c, nil
}

func UpdateItemQueryFromRequest(msg *pb.ItemServiceUpsertItemRequest) ([]*ItemUpdate, error) {
	c := []*ItemUpdate{}
	for _, om := range msg.Items {
		if om.GetUserId() == "" {
			return nil, errors.New("no userId sent with request")
		}
		id := om.GetId()
		if id == "" {
			id = uuid.Must(uuid.NewV7()).String()
		}

		a := &ItemUpdate{
			Filter: map[string] string{ "_id": id, "userId": om.GetUserId()},
			Update: map[string] map[string] interface{}{
				"$set": {
					"_id": id,
					"userId": om.GetUserId(),
					"tags": om.GetTags(),
					"title": om.GetTitle(),
					"properties": om.GetProperties(),
					"reactivateAt": om.GetReactivateAt().AsTime(),
					"softDelete": om.GetSoftDelete(),
					"updatedAt": time.Now().UTC(),
					"updatedBy": "api",
				},
			},
		}
		c = append(c, a)
	}
	return c, nil
}

func ReplaceItemQueryFromRequest(msg *pb.ItemServiceUpsertItemRequest) ([]*ItemReplace, error) {
	c := []*ItemReplace{}
	for _, om := range msg.Items {
		if om.GetUserId() == "" {
			return nil, errors.New("no userId sent with request")
		}
		id := om.GetId()
		if id == "" {
			id = uuid.Must(uuid.NewV7()).String()
		}
		a := &ItemReplace{
			Filter: map[string] string{ "_id": id, "userId": om.GetUserId()},
			Replace: map[string] interface{}{
				"_id": id,
				"userId": om.GetUserId(),
				"tags": om.GetTags(),
				"title": om.GetTitle(),
				"properties": om.GetProperties(),
				"reactivateAt": om.GetReactivateAt().AsTime(),
				"softDelete": om.GetSoftDelete(),
				"updatedAt": time.Now().UTC(),
				"updatedBy": "api",
			},
		}
		c = append(c, a)
	}
	return c, nil
}


func ReadItemQueryFromRequest(msg *pb.ItemServiceReadItemRequest) (*ItemRead, error) {
	if msg.GetUserId() == "" {
		return nil, errors.New("no userId sent with request")
	}
	l := ItemRead{
		Filter: map[string] interface{}{"userId": msg.GetUserId()},
	}
	if msg.GetTags() != nil {
		// l["tags"] = map[string] []string{"tags": {"$in": msg.GetTags()}}
		l.Filter["tags"] = map[string] interface{}{"$in": msg.GetTags()}
	}

	if msg.GetItemIds() != nil {
		// l.Filter["_id"] = map[string] interface{}{"_id": {"$in": msg.GetItemIds()}}
		l.Filter["_id"] = map[string] interface{}{"$in": msg.GetItemIds()}
	}

	// if msg.GetSearchQuery() == "" {
	// 	// sQ = {"searchQuery": msg.GetItemIds()}
	// 	// a.Filter["$and"] =  append(a.Filter["$and"], interface{}{"searchQuery": msg.GetItemIds()})
	// 	// l =  append(l, map[string] map[string] string{"searchQuery": msg.GetSearchQuery()})
	// 	l["searchQuery"] = map[string] []string{"_id": {"$in": msg.GetItemIds()}}
	// }


	return &l, nil
}


func (c *Item) ToReadResponse() (*pb.Item, error ){
	return &pb.Item{
		ReactivateAt: timestamppb.New(c.ReactivateAt),
		UpdatedBy: &c.UpdatedBy,
		Properties: c.Properties,
		Id: c.Id,
		UserId: c.UserId,
		Title: c.Title,
		UpdatedAt: timestamppb.New(c.UpdatedAt),
		Tags: c.Tags,
	}, nil
}


func ItemModelToReadResponse(m []*Item) ([]*pb.Item, error ){
	c := []*pb.Item{}
	for _, i := range m {
		r, err := i.ToReadResponse()
		if err != nil {
			return nil, err
		}
		c = append(c, r)
	}
	return c, nil
}
