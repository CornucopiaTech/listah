package v1

import (
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"errors"
	"time"

	"github.com/google/uuid"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func FilterModelToFilterProto(m []*Filter) ([]*pb.Filter, error) {
	c := []*pb.Filter{}
	for _, v := range m {
		c = append(c, &pb.Filter{
			Id:         v.Id,
			UserId:     v.UserId,
			Name:       v.Name,
			Tags:       v.Tags,
			Count:      int32(v.Count),
			SoftDelete: v.SoftDelete,
			UpdatedAt:  timestamppb.New(v.UpdatedAt),
			UpdatedBy:  v.UpdatedBy,
		})
	}
	return c, nil
}

func FilterProtoToFilterModel(msg []*pb.Filter, genId bool) ([]*Filter, []string, error) {
	savedFilters := []*Filter{}

	// check := map[string]bool{"name": true}
	check := map[string]bool{"name": true, "updated_by": true, "updated_at": true}
	for _, v := range msg {
		if v.GetUserId() == "" {
			return nil, nil, errors.New("userId is required")
		}
		if v.GetName() == "" {
			return nil, nil, errors.New("name of filter is required")
		}
		if len(v.GetTags()) == 0 {
			return nil, nil, errors.New("at least one tag is required")
		}

		id := v.GetId()
		if id == "" && genId {
			id = uuid.Must(uuid.NewV7()).String()
		}
		newItem := &Filter{
			Id:        id,
			UserId:    v.GetUserId(),
			Name:      v.GetName(),
			UpdatedBy: "api",
			UpdatedAt: time.Now(),
		}

		// Set values that have not been set to nil
		if len(v.GetTags()) != 0 {
			newItem.Tags = v.GetTags()
			check["tags"] = true
		}

		if v.GetSoftDelete() {
			newItem.SoftDelete = v.GetSoftDelete()
			check["soft_delete"] = true
		}
		savedFilters = append(savedFilters, newItem)
	}

	res := []string{}
	for k, _ := range check {
		res = append(res, k)
	}

	return savedFilters, res, nil
}
