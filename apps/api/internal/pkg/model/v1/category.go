package v1

import (
	pb "cornucopia/listah/apps/api/internal/pkg/proto/v1"

)


type Category struct {
	Category        string
	RowCount int
	Id string
}



func CategoryModelToCategoryProto(m []*Category) ([]*pb.Category, error) {
	c := []*pb.Category{}
	for _, v := range m {
		c = append(c, &pb.Category{
				Category: v.Category,
				RowCount: int32(v.RowCount),
				Id: &v.Id,
		})
	}
	return c, nil
}

