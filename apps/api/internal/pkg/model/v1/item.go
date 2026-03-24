package v1

import (
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"time"

	// "strings"
	// "fmt"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"google.golang.org/protobuf/types/known/timestamppb"
	// "go.mongodb.org/mongo-driver/v2/bson"
)

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
			Id:     id,
			UserId: om.GetUserId(),
			Name:   om.GetName(),
			Tags:   om.GetTags(),
			Props:  om.GetProps(),
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
			Filter: map[string]string{"_id": id, "userId": om.GetUserId()},
			Update: map[string]map[string]interface{}{
				"$set": {
					"_id":        id,
					"userId":     om.GetUserId(),
					"tags":       om.GetTags(),
					"title":      om.GetName(),
					"properties": om.GetProps(),
					"softDelete": om.GetSoftDelete(),
					"updatedAt":  time.Now().UTC(),
					"updatedBy":  "api",
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
			Filter: map[string]string{"_id": id, "userId": om.GetUserId()},
			Replace: map[string]interface{}{
				"_id":        id,
				"userId":     om.GetUserId(),
				"tags":       om.GetTags(),
				"title":      om.GetName(),
				"properties": om.GetProps(),
				"softDelete": om.GetSoftDelete(),
				"updatedAt":  time.Now().UTC(),
				"updatedBy":  "api",
			},
		}
		c = append(c, a)
	}
	return c, nil
}

func ReadItemQueryFromRequest(msg *pb.ItemServiceReadItemRequest) (*ItemRead, *Pagination, error) {
	if msg.GetUserId() == "" {
		return nil, nil, errors.New("no userId sent with request")
	}
	l := ItemRead{
		Filter: map[string]interface{}{"userId": msg.GetUserId()},
	}

	q := msg.GetQuery()
	if q != nil && q.Tags != nil {
		l.Filter["tags"] = map[string]interface{}{"$in": q.Tags}
	}

	// if msg.GetItemIds() != nil {
	// 	// l.Filter["_id"] = map[string] interface{}{"_id": {"$in": msg.GetItemIds()}}
	// 	l.Filter["_id"] = map[string]interface{}{"$in": msg.GetItemIds()}
	// }

	// if msg.GetSearchQuery() == "" {
	// 	// sQ = {"searchQuery": msg.GetItemIds()}
	// 	// a.Filter["$and"] =  append(a.Filter["$and"], interface{}{"searchQuery": msg.GetItemIds()})
	// 	// l =  append(l, map[string] map[string] string{"searchQuery": msg.GetSearchQuery()})
	// 	l["searchQuery"] = map[string] []string{"_id": {"$in": msg.GetItemIds()}}
	// }

	pg := DefaultPagination
	if msg.GetPagination() != nil {
		if msg.GetPagination().PageSize != 0 {
			pg.PageSize = msg.GetPagination().PageSize
		}
		if msg.GetPagination().PageNumber != 0 {
			pg.PageNumber = msg.GetPagination().PageNumber
		}
		if msg.GetPagination().Sort == "" {
			pg.Sort = msg.GetPagination().Sort
		}
	}
	// offset := pSize * (pNum - 1)

	return &l, &pg, nil
}

func ReadCountItemQueryFromRequest(msg *pb.ItemServiceReadItemRequest) (*ItemReadCountFilter, *Pagination, error) {
	if msg.GetUserId() == "" {
		return nil, nil, errors.New("no userId sent with request")
	}
	l := ItemReadCountFilter{
		UserId: msg.GetUserId(),
	}

	q := msg.GetQuery()
	if q != nil && q.Tags != nil {
		l.Tags = q.Tags
	}

	// if msg.GetItemIds() != nil {
	// 	// l.Filter["_id"] = map[string] interface{}{"_id": {"$in": msg.GetItemIds()}}
	// 	l.Filter["_id"] = map[string]interface{}{"$in": msg.GetItemIds()}
	// }

	// if msg.GetSearchQuery() == "" {
	// 	// sQ = {"searchQuery": msg.GetItemIds()}
	// 	// a.Filter["$and"] =  append(a.Filter["$and"], interface{}{"searchQuery": msg.GetItemIds()})
	// 	// l =  append(l, map[string] map[string] string{"searchQuery": msg.GetSearchQuery()})
	// 	l["searchQuery"] = map[string] []string{"_id": {"$in": msg.GetItemIds()}}
	// }

	pg := DefaultPagination
	if msg.GetPagination() != nil {
		if msg.GetPagination().PageSize != 0 {
			pg.PageSize = msg.GetPagination().PageSize
		}
		if msg.GetPagination().PageNumber != 0 {
			pg.PageNumber = msg.GetPagination().PageNumber
		}
		if msg.GetPagination().Sort == "" {
			pg.Sort = msg.GetPagination().Sort
		}
	}
	// offset := pSize * (pNum - 1)

	return &l, &pg, nil
}

func (c *Item) ToReadResponse() (*pb.Item, error) {
	return &pb.Item{
		UpdatedBy: &c.UpdatedBy,
		Props:     c.Props,
		Id:        c.Id,
		UserId:    c.UserId,
		Name:      c.Name,
		UpdatedAt: timestamppb.New(c.UpdatedAt),
		Tags:      c.Tags,
	}, nil
}

// func ItemModelToReadResponse(m []*Item) ([]*pb.Item, error) {
func ItemModelToReadResponse(m *[]Item) ([]*pb.Item, error) {
	c := []*pb.Item{}
	for _, i := range *m {
		r, err := i.ToReadResponse()
		if err != nil {
			return nil, err
		}
		c = append(c, r)
	}
	return c, nil
}
