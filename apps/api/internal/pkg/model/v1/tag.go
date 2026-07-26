package v1

import (
	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"google.golang.org/protobuf/types/known/timestamppb"
	"time"

	pb "cornucopia/listah/internal/pkg/proto/v1"
)

type Tag struct {
	bun.BaseModel `bun:"table:apps.tags,alias:t"`
	Id            string `bun:",pk"`
	UserId        string
	Name          string
	Props         []string
	Count         int32 `bun:",scanonly"`
	SoftDelete    bool
	UpdatedBy     string
	UpdatedAt     time.Time
}

func (v *Tag) ToTagProto() *pb.Tag {
	return &pb.Tag{
		Id:         v.Id,
		UserId:     v.UserId,
		Name:       v.Name,
		Props:      v.Props,
		Count:      int32(v.Count),
		SoftDelete: v.SoftDelete,
		UpdatedAt:  timestamppb.New(v.UpdatedAt),
		UpdatedBy:  v.UpdatedBy,
	}
}

func TagModelListToTagProtoList(m []*Tag) []*pb.Tag {
	c := []*pb.Tag{}
	for _, v := range m {
		c = append(c, v.ToTagProto())
	}
	return c
}

func TagProtoToTagModel(msg []*pb.Tag, genId bool) ([]*Tag, []string, error) {
	items := []*Tag{}
	check := map[string]bool{"name": true, "updated_by": true, "updated_at": true}

	for _, v := range msg {
		if v.GetUserId() == "" {
			return nil, nil, MissingUserId
		}
		if v.GetName() == "" {
			return nil, nil, MissingName
		}
		if len(v.GetProps()) == 0 {
			return nil, nil, MissingProps
		}
		gProps := []string{}
		for _, gP := range v.GetProps() {
			if gP != "" {
				gProps = append(gProps, gP)
			}
		}
		if len(gProps) == 0 {
			return nil, nil, MissingProps
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
	for k := range check {
		res = append(res, k)
	}
	return items, res, nil
}

func TagPropertyModelToTagPropertyMapProto(m []TagPropertyMapModel) map[string]*pb.StringList {
	r := map[string]*pb.StringList{}
	for _, v0 := range m {
		for k, v1 := range v0.Props {
			r[k] = &pb.StringList{Value: v1}
		}
	}
	return r
}

func MapModelToTagPropertyMapProto(m []TagPropertyMapModel) map[string]*pb.StringList {
	r := map[string]*pb.StringList{}

	for _, v0 := range m {
		for k, v1 := range v0.Props {
			r[k] = &pb.StringList{Value: v1}
		}
	}

	return r
}
