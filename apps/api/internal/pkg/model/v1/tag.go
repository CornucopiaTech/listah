package v1

import (
	pb "cornucopia/listah/internal/pkg/proto/v1"

	// "strings"
	"fmt"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func ReadCountTagQueryFromRequest(msg *pb.ItemServiceReadTagRequest) (*ItemReadCountFilter, *Pagination, error) {
	if msg.GetUserId() == "" {
		return nil, nil, errors.New("no userId sent with request")
	}
	l := ItemReadCountFilter{
		UserId: msg.GetUserId(),
	}

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
	l.Pagination = pg

	return &l, &pg, nil
}

func PrepareTagReadResponse(m []bson.M, msg *pb.ItemServiceReadTagRequest, pg *Pagination) (*pb.ItemServiceReadTagResponse, error) {
	rs := []*pb.Tag{}
	res := &pb.ItemServiceReadTagResponse{
		Tags:             rs,
		TotalRecordCount: 0,
		Pagination: &pb.Pagination{
			PageSize:   pg.PageSize,
			PageNumber: pg.PageNumber,
			Sort:       pg.Sort,
		},
	}

	fmt.Printf("\n\nm %+v \n\n", m)
	r := m[0]["tags"].(bson.A)
	if len(r) == 0 {
		return res, nil
	}

	rs, err := BsonMapListToReadTagResponse(r)
	if err != nil {
		return nil, err
	}
	res.Tags = rs
	res.TotalRecordCount = m[0]["totalDistinctTags"].(int32)
	return res, nil
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
