package v1

import (
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"fmt"
	"time"

	// "strings"
	// "fmt"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type Item struct {
	UpdatedBy  string
	Props      map[string]string
	Id         string `bson:"_id"`
	UserId     string
	Name       string
	UpdatedAt  time.Time
	Tags       []string
	SoftDelete bool
}

func UpdateItemQueryFromRequest(msg *pb.ItemServiceUpsertItemRequest) ([]*RepoUpdate, error) {
	c := []*RepoUpdate{}
	for _, om := range msg.Items {
		if om.GetUserId() == "" {
			return nil, errors.New("no userId sent with request")
		}
		id := om.GetId()
		if id == "" {
			id = uuid.Must(uuid.NewV7()).String()
		}

		a := &RepoUpdate{
			Filter: map[string]string{"_id": id, "userId": om.GetUserId()},
			Update: map[string]map[string]interface{}{
				"$set": {
					"_id":        id,
					"userId":     om.GetUserId(),
					"tags":       om.GetTags(),
					"name":       om.GetName(),
					"props":      om.GetProps(),
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

func ItemModelFromItemUpdateRequest(msg *pb.ItemServiceUpsertItemRequest) ([]*Item, error) {
	c := []*Item{}
	for _, om := range msg.Items {
		if om.GetUserId() == "" {
			return nil, errors.New("no userId sent with request")
		}
		id := om.GetId()
		if id == "" {
			id = uuid.Must(uuid.NewV7()).String()
		}

		c = append(c, &Item{
			Id:         id,
			UserId:     om.GetUserId(),
			Tags:       om.GetTags(),
			Name:       om.GetName(),
			Props:      om.GetProps(),
			SoftDelete: om.GetSoftDelete(),
			UpdatedAt:  time.Now().UTC(),
			UpdatedBy:  "api",
		})
	}
	return c, nil
}

func UpdateTagQueryFromItemUpdateRequest(msg *pb.ItemServiceUpsertItemRequest) ([]*RepoUpdate, error) {
	c := []*RepoUpdate{}
	checkTags := map[string]bool{}
	for _, om := range msg.Items {
		if om.GetUserId() == "" {
			return nil, errors.New("no userId sent with request")
		}

		for _, tt := range om.GetTags() {
			if tt == "" {
				return nil, errors.New("no tag name sent with request")
			}
			if _, ok := checkTags[tt]; !ok {
				checkTags[tt+"_"+om.GetUserId()] = true
				c = append(c, &RepoUpdate{
					Filter: map[string]string{
						"name":   tt,
						"userId": om.GetUserId(),
					},
					Update: map[string]map[string]interface{}{
						"$set": {
							"userId":    om.GetUserId(),
							"name":      tt,
							"updatedAt": time.Now().UTC(),
							"updatedBy": "api",
						},
					},
				})
			}
		}
	}
	// fmt.Printf("\n\nc %+v \n\n", c[0])
	return c, nil
}

func ReadItemQueryFromRequest(msg *pb.ItemServiceReadItemRequest) (*RepoReadCountFilter, error) {
	if msg.GetUserId() == "" {
		return nil, errors.New("no userId sent with request")
	}
	l := RepoReadCountFilter{
		UserId: msg.GetUserId(),
	}

	q := msg.GetQuery()
	if q != nil && q.Tags != nil {
		l.Tags = q.Tags
	} else {
		l.Tags = []string{}
	}

	if q != nil && q.Text != "" {
		l.Search = q.Text
	} else {
		l.Search = ""
	}

	pg := DefaultPagination
	if msg.GetPagination() != nil {
		if msg.GetPagination().PageSize > 0 {
			pg.PageSize = int64(msg.GetPagination().PageSize)
		}
		if msg.GetPagination().PageNumber != 0 {
			pg.PageNumber = int64(msg.GetPagination().PageNumber)
		}
		if msg.GetPagination().Sort == "" {
			pg.Sort = msg.GetPagination().Sort
		}
	}
	l.Pagination = pg
	// fmt.Printf("\n\nl %+v \n\n", l)

	return &l, nil
}

func PrepareRepoReadResponse(m []bson.M, res *pb.ItemServiceReadItemResponse) error {
	fmt.Printf("\n\nm %+v \n\n", m)
	// Check if any result returned.
	r := m[0]["results"].(bson.A)
	if len(r) == 0 {
		return nil
	}

	// Parse db result to response form
	rs, err := BsonMapListToReadItemResponse(r)
	if err != nil {
		return err
	}
	res.Items = rs

	// Read total number of results
	tc := m[0]["totalCount"].(bson.A)[0].(bson.D)
	ds, err := bson.Marshal(tc)
	var tm bson.M
	err = bson.Unmarshal(ds, &tm)
	if err != nil {
		return err
	}
	res.TotalRecordCount = tm["count"].(int32)
	return nil
}

func BsonMapToReadItemResponse(c bson.M) (*pb.Item, error) {
	ut := time.Now().UTC()
	if c["updatedAt"] != nil {
		ct, ok := c["updatedAt"].(bson.DateTime)
		if !ok {
			return nil, errors.New("Unable to read updateAt from document")
		}
		ut = ct.Time()
	}

	ts := []string{}
	if c["tags"] != nil {
		t, ok := c["tags"].(bson.A)
		if !ok {
			return nil, errors.New("Unable to read tags from document")
		}

		for _, i := range t {
			ts = append(ts, i.(string))
		}
	}

	var tm map[string]string
	if c["props"] != nil {
		pd := c["props"].(bson.D)
		pm, err := bson.Marshal(pd)
		if err != nil {
			return nil, err
		}

		err = bson.Unmarshal(pm, &tm)
		if err != nil {
			return nil, err
		}
	}

	return &pb.Item{
		UpdatedBy: (c["updatedBy"].(string)),
		Props:     tm,
		Id:        c["_id"].(string),
		UserId:    c["userId"].(string),
		Name:      c["name"].(string),
		UpdatedAt: timestamppb.New(ut),
		Tags:      ts,
	}, nil
}

func BsonMapListToReadItemResponse(m bson.A) ([]*pb.Item, error) {
	c := []*pb.Item{}
	for _, i := range m {
		tc := i.(bson.D)
		ds, err := bson.Marshal(tc)
		if err != nil {
			return nil, err
		}
		var tm bson.M
		err = bson.Unmarshal(ds, &tm)
		if err != nil {
			return nil, err
		}

		r, err := BsonMapToReadItemResponse(tm)
		if err != nil {
			return nil, err
		}
		c = append(c, r)
	}
	return c, nil
}
