package v1

import (
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"fmt"

	// "strings"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type Filter struct {
	Id     string `bson:"_id"`
	UserId string
	Name   string
	Tags   []string
	Count  int32
}

func InsertFilterQueryFromRequest(msg *pb.ItemServiceUpsertFilterRequest) ([]*Filter, error) {
	c := []*Filter{}
	for _, om := range msg.Filters {
		if om.GetUserId() == "" {
			return nil, errors.New("no userId sent with request")
		}
		id := om.GetId()
		if id == "" {
			id = uuid.Must(uuid.NewV7()).String()
		}
		a := &Filter{
			Id:     id,
			UserId: om.GetUserId(),
			Name:   om.GetName(),
			Tags:   om.GetTags(),
		}
		c = append(c, a)
	}
	return c, nil
}

func UpdateFilterQueryFromRequest(msg *pb.ItemServiceUpsertFilterRequest) ([]*RepoUpdate, error) {
	c := []*RepoUpdate{}
	for _, om := range msg.Filters {
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
					"_id":    id,
					"userId": om.GetUserId(),
					"tags":   om.GetTags(),
					"name":   om.GetName(),
				},
			},
		}
		c = append(c, a)
	}
	fmt.Printf("\n\nc %+v \n\n", c)
	return c, nil
}

func ReplaceFilterQueryFromRequest(msg *pb.ItemServiceUpsertFilterRequest) ([]*RepoReplace, error) {
	c := []*RepoReplace{}
	for _, om := range msg.Filters {
		if om.GetUserId() == "" {
			return nil, errors.New("no userId sent with request")
		}
		id := om.GetId()
		if id == "" {
			id = uuid.Must(uuid.NewV7()).String()
		}
		a := &RepoReplace{
			Filter: map[string]string{"_id": id, "userId": om.GetUserId()},
			Replace: map[string]interface{}{
				"_id":    id,
				"userId": om.GetUserId(),
				"tags":   om.GetTags(),
				"name":   om.GetName(),
			},
		}
		c = append(c, a)
	}
	return c, nil
}

func ReadFilterQueryFromRequest(msg *pb.ItemServiceReadFilterRequest) (*RepoReadCountFilter, error) {
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

func PrepareFilterReadResponse(m []bson.M, res *pb.ItemServiceReadFilterResponse) error {
	// fmt.Printf("\n\nm %+v \n\n", m)
	// Check if any result returned.
	r := m[0]["results"].(bson.A)
	if len(r) == 0 {
		return nil
	}

	// Parse db result to response form
	rs, err := BsonMapListToReadFilterResponse(r)
	if err != nil {
		return err
	}
	res.Filters = rs

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

func BsonMapToReadFilterResponse(c bson.M) (*pb.Filter, error) {
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

	return &pb.Filter{
		Id:    c["_id"].(string),
		Name:  c["name"].(string),
		Tags:  ts,
		Count: c["count"].(int32),
	}, nil
}

func BsonMapListToReadFilterResponse(m bson.A) ([]*pb.Filter, error) {
	c := []*pb.Filter{}
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

		r, err := BsonMapToReadFilterResponse(tm)
		if err != nil {
			return nil, err
		}
		c = append(c, r)
	}
	return c, nil
}
