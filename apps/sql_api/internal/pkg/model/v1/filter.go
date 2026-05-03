package v1

import (
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"errors"

	"github.com/google/uuid"
)

func FilterProtoToFilterModel(msg []*pb.Filter, genId bool) ([]*FilterUpsert, []string, error) {
	savedFilters := []*FilterUpsert{}

	check := map[string]bool{"name": true}
	for _, v := range msg {
		if v.GetUserId() == "" {
			return nil, nil, errors.New("no userId sent with request")
		}
		if v.GetName() == "" {
			return nil, nil, errors.New("no filter name sent with request")
		}
		id := v.GetId()
		if id == "" && genId {
			id = uuid.Must(uuid.NewV7()).String()
		}
		newItem := &FilterUpsert{
			Id:     id,
			UserId: v.GetUserId(),
			Name:   v.GetName(),
		}

		// Set values that have not been set to nil
		if len(v.GetTags()) != 0 {
			newItem.Tags = v.GetTags()
			check["tags"] = true
		}

		savedFilters = append(savedFilters, newItem)
	}

	res := []string{}
	for k, _ := range check {
		res = append(res, k)
	}

	return savedFilters, res, nil
}

func FilterModelToFilterProto(m []*Filter) ([]*pb.Filter, error) {
	c := []*pb.Filter{}
	for _, v := range m {
		c = append(c, &pb.Filter{
			Id:     v.Id,
			UserId: v.UserId,
			Name:   v.Name,
			Tags:   v.Tags,
			Count:  int32(v.Count),
		})
	}
	return c, nil
}
