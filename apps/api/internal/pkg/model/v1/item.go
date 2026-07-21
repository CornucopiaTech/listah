package v1

import (
	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"google.golang.org/protobuf/types/known/timestamppb"
	"time"

	pb "cornucopia/listah/internal/pkg/proto/v1"
)

var ItemConflictFields = []string{
	"id", "user_id",
}

type Item struct {
	bun.BaseModel `bun:"table:apps.items,alias:it"`
	Id            string `bun:",pk"`
	UserId        string
	Name          string
	Note          string
	Tags          []string          `bun:"type:jsonb"`
	Props         map[string]string `bun:"type:jsonb"`
	SoftDelete    bool              `bun:",nullzero,default:false"`
	TagObjs       []Tag             `bun:"type:jsonb,scanonly"`
	PropObjs      []MapObj          `bun:"type:jsonb,scanonly"`
	UpdatedBy     string
	UpdatedAt     time.Time
}

func (v *Item) ItemModelToItemProto() *pb.Item {
	to := []*pb.Tag{}
	for _, iv := range v.TagObjs {
		to = append(to, &pb.Tag{
			Id:     iv.Id,
			UserId: iv.UserId,
			Name:   iv.Name,
			Props:  iv.Props,
		})
	}
	mo := []*pb.MapObj{}
	for _, iv := range v.PropObjs {
		mo = append(mo, &pb.MapObj{
			Key:   iv.Key,
			Value: iv.Value,
		})
	}
	return &pb.Item{
		Id:         v.Id,
		UserId:     v.UserId,
		Name:       v.Name,
		Note:       v.Note,
		Tags:       v.Tags,
		Props:      v.Props,
		SoftDelete: v.SoftDelete,
		TagObjs:    to,
		PropObjs:   mo,
		UpdatedAt:  timestamppb.New(v.UpdatedAt),
		UpdatedBy:  v.UpdatedBy,
	}
}

func ItemModelListToItemProtoList(m []*Item) ([]*pb.Item, error) {
	items := []*pb.Item{}
	for _, v := range m {
		to := []*pb.Tag{}
		for _, iv := range v.TagObjs {
			to = append(to, &pb.Tag{
				Id:     iv.Id,
				UserId: iv.UserId,
				Name:   iv.Name,
				Props:  iv.Props,
			})
		}
		mo := []*pb.MapObj{}
		for _, iv := range v.PropObjs {
			mo = append(mo, &pb.MapObj{
				Key:   iv.Key,
				Value: iv.Value,
			})
		}
		items = append(items, &pb.Item{
			Id:         v.Id,
			UserId:     v.UserId,
			Name:       v.Name,
			Note:       v.Note,
			Tags:       v.Tags,
			Props:      v.Props,
			SoftDelete: v.SoftDelete,
			TagObjs:    to,
			PropObjs:   mo,
			UpdatedAt:  timestamppb.New(v.UpdatedAt),
			UpdatedBy:  v.UpdatedBy,
		})
	}
	return items, nil
}

func ItemProtoToItemModel(msg []*pb.Item, genId bool) ([]*Item, []string, error) {
	items := []*Item{}
	check := map[string]bool{"name": true, "updated_by": true, "updated_at": true}

	for _, v := range msg {
		if v.GetUserId() == "" {
			return nil, nil, MissingUserId
		}
		if v.GetName() == "" {
			return nil, nil, MissingName
		}
		if len(v.GetTags()) == 0 {
			return nil, nil, MissingTags
		}
		gTags := []string{}
		for _, gP := range v.GetTags() {
			if gP != "" {
				gTags = append(gTags, gP)
			}
		}
		if len(gTags) == 0 {
			return nil, nil, MissingTags
		}

		id := v.GetId()
		if id == "" && genId {
			id = uuid.Must(uuid.NewV7()).String()
		}
		newItem := &Item{
			Id:        id,
			UserId:    v.GetUserId(),
			Name:      v.GetName(),
			UpdatedBy: "api",
			UpdatedAt: time.Now(),
		}

		// Set values that have not been set to nil
		if v.GetNote() != "" {
			newItem.Note = v.GetNote()
			check["note"] = true
		}
		if len(v.GetTags()) != 0 {
			newItem.Tags = v.GetTags()
			check["tags"] = true
		}
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
