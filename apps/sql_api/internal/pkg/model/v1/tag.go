package v1

import (
	pb "cornucopia/listah/internal/pkg/proto/v1"
)

func TagModelToTagProto(m []*Tag) ([]*pb.Tag, error) {
	c := []*pb.Tag{}
	for _, v := range m {
		c = append(c, &pb.Tag{
			Id: v.Id,
			UserId: v.UserId,
			Name:   v.Name,
			Props:   v.Props,
			Count:  int32(v.Count),
		})
	}
	return c, nil
}
