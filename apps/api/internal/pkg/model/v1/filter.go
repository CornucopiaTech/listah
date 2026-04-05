package v1

import (
	pb "cornucopia/listah/internal/pkg/proto/v1"

	"github.com/google/uuid"
)

func FilterProtoToFilterModel(msg []*pb.Filter, genId bool) ([]*Filter, []string, error) {
	savedFilters := []*Filter{}

	check := map[string]bool{}
	for _, v := range msg {
		id := v.GetId()
		if id == "" && genId {
			id = uuid.Must(uuid.NewV7()).String()
		}
		newItem := &Filter{
			Id:     id,
			UserId: v.GetUserId(),
		}

		// Set values that have not been set to nil
		if v.GetName() != "" {
			newItem.Name = v.GetName()
			check["name"] = true
		}
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
