package v1

import (
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"errors"
	"time"

	"github.com/google/uuid"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func TagModelToTagProto(m []*Tag) ([]*pb.Tag, error) {
	c := []*pb.Tag{}
	for _, v := range m {
		c = append(c, &pb.Tag{
			Id:         v.Id,
			UserId:     v.UserId,
			Name:       v.Name,
			Props:      v.Props,
			Count:      int32(v.Count),
			SoftDelete: v.SoftDelete,
			UpdatedAt:  timestamppb.New(v.UpdatedAt),
			UpdatedBy:  v.UpdatedBy,
		})
	}
	return c, nil
}

func TagProtoToTagModel(msg []*pb.Tag, genId bool) ([]*Tag, []string, error) {
	items := []*Tag{}
	// check := map[string]bool{"name": true}
	check := map[string]bool{"name": true, "updated_by": true, "updated_at": true}

	for _, v := range msg {
		if v.GetUserId() == "" {
			return nil, nil, errors.New("no userId sent with request")
		}
		if v.GetName() == "" {
			return nil, nil, errors.New("no tag name sent with request")
		}

		id := v.GetId()
		if id == "" && genId {
			id = uuid.Must(uuid.NewV7()).String()
		}
		newItem := &Tag{
			Id:        id,
			UserId:    v.GetUserId(),
			Name:      v.GetName(),
			UpdatedBy: "api",
			UpdatedAt: time.Now(),
		}

		// Set values that have not been set to nil
		if len(v.GetProps()) != 0 {
			newItem.Props = v.GetProps()
			check["props"] = true
		}
		if v.GetSoftDelete() {
			newItem.SoftDelete = v.GetSoftDelete()
			check["soft_delete"] = true
		}
		items = append(items, newItem)
	}

	// Get the fields that need to be updated for conflict resolution
	res := []string{}
	for k, _ := range check {
		res = append(res, k)
	}
	return items, res, nil
}
