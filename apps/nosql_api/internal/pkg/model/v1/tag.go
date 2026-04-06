package v1

import (
	"cornucopia/listah/internal/pkg/model"
	pb "cornucopia/listah/internal/pkg/proto/v1"

	// "strings"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/pkg/errors"

	"go.mongodb.org/mongo-driver/v2/bson"
)

func ReadTagQueryFromRequest(msg *pb.ItemServiceReadTagRequest) (*RepoReadCountFilter, error) {
	iR := &pb.ItemServiceReadItemRequest{}
	err := model.MarshalCopyProto(msg, iR)
	if err != nil {
		return nil, err
	}

	l, err := ReadItemQueryFromRequest(iR)
	if err != nil {
		return nil, err
	}

	return l, nil
}

func UpdateTagQueryFromRequest(msg *pb.ItemServiceUpsertTagRequest) ([]*RepoUpdate, error) {
	c := []*RepoUpdate{}
	for _, om := range msg.Tags {
		if om.GetUserId() == "" {
			return nil, errors.New("no userId sent with request")
		}
		id := om.GetId()
		if id == "" {
			id = uuid.Must(uuid.NewV7()).String()
		}

		a := &RepoUpdate{
			Filter: map[string]string{
				"name":   om.GetName(),
				"userId": om.GetUserId(),
			},
			Update: map[string]map[string]interface{}{
				"$set": {
					"_id":       id,
					"userId":    om.GetUserId(),
					"name":      om.GetName(),
					"updatedAt": time.Now().UTC(),
					"updatedBy": "api",
				},
			},
		}
		c = append(c, a)
	}
	// fmt.Printf("\n\nc %+v \n\n", c)
	return c, nil
}

func PrepareTagReadResponse(m []bson.M, res *pb.ItemServiceReadTagResponse) error {
	fmt.Printf("\n\nm %+v \n\n", m)
	r := m[0]["results"].(bson.A)
	if len(r) == 0 {
		return nil
	}

	rs, err := BsonMapListToReadTagResponse(r)
	if err != nil {
		return err
	}
	res.Tags = rs

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

func BsonMapToReadTagResponse(c bson.M) (*pb.Tag, error) {
	return &pb.Tag{
		Id:     c["_id"].(bson.ObjectID).Hex(),
		UserId: c["userId"].(string),
		Name:   c["name"].(string),
		// Props:  c["props"].(string),
		Count: c["count"].(int32),
	}, nil
}

func BsonMapListToReadTagResponse(m bson.A) ([]*pb.Tag, error) {
	c := []*pb.Tag{}
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

		r, err := BsonMapToReadTagResponse(tm)
		if err != nil {
			return nil, err
		}
		c = append(c, r)
	}
	return c, nil
}
