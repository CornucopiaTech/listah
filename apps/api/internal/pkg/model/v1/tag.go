package v1

import (
	"cornucopia/listah/internal/pkg/model"
	pb "cornucopia/listah/internal/pkg/proto/v1"

	// "strings"
	"fmt"

	"go.mongodb.org/mongo-driver/v2/bson"
)

func ReadCountTagQueryFromRequest(msg *pb.ItemServiceReadTagRequest) (*RepoReadCountFilter, error) {
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

func PrepareTagReadResponse(m []bson.M, res *pb.ItemServiceReadTagResponse) error {
	fmt.Printf("\n\nm %+v \n\n", m)
	r := m[0]["tags"].(bson.A)
	if len(r) == 0 {
		return nil
	}

	rs, err := BsonMapListToReadTagResponse(r)
	if err != nil {
		return err
	}
	res.Tags = rs
	res.TotalRecordCount = m[0]["totalDistinctTags"].(int32)
	return nil
}

func BsonMapToReadTagResponse(c bson.M) (*pb.Tag, error) {
	return &pb.Tag{
		Name:  c["_id"].(string),
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
