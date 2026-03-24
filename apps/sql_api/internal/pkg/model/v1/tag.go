package v1

import (
	"cornucopia/listah/internal/pkg/model"
	pb "cornucopia/listah/internal/pkg/proto/v1"
)

func TagModelToTagProto(m []*model.Tag) ([]*pb.Tag, error) {
	c := []*pb.Tag{}
	for _, v := range m {
		c = append(c, &pb.Tag{
			UserId: v.UserId,
			Name:   v.Name,
			Count:  int32(v.Count),
		})
	}
	return c, nil
}
