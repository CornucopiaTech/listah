package v1

import (
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"google.golang.org/protobuf/types/known/timestamppb"
)

var svcName string = "listah.v1.ItemService"
var ItemConflictFields = []string{
	"id", "user_id",
}
var defaultPagination = Pagination{
	PageNumber: 1,
	PageSize:   100,
	Sort:       "name ASC",
}

func ReadItemRequestToRepoItemSearch(msg *pb.ItemServiceReadItemRequest) (*ItemSearch, error) {
	if msg.GetUserId() == "" {
		return nil, errors.New("no userId sent with request")
	}

	pSize := defaultPagination.PageSize
	pNum := defaultPagination.PageNumber
	sortT := defaultPagination.Sort

	pg := msg.GetPagination()
	if pg != nil {
		if pSize > 0 {
			pSize = pg.PageSize
		}
		if pNum > 0 {
			pNum = pg.PageNumber
		}
		if sortT != "" {
			sortT = pg.Sort
		}
	}

	offset := pSize * (pNum - 1)

	s := []string{}
	t := []string{}
	st := ""
	q := msg.GetQuery()
	if q != nil {
		if q.Filters != nil {
			for _, v := range msg.GetQuery().Filters {
				s = append(s, fmt.Sprintf(`'%v'`, v))
			}
		}

		if q.Tags != nil {
			for _, v := range msg.GetQuery().Tags {
				t = append(t, fmt.Sprintf(`'%v'`, v))
			}
		}

		if q.Text != "" {
			st = q.Text
		}
	}

	i := ItemSearch{
		UserId:      msg.GetUserId(),
		Tags:        strings.Join(t, ", "),
		Filters:     strings.Join(s, ", "),
		SearchQuery: st,
		SortQuery:   sortT,
		Limit:       pSize,
		Offset:      offset,
		PageNumber:  pNum,
	}
	return &i, nil
}

func ItemModelToItemProto(m []*Item) ([]*pb.Item, error) {
	items := []*pb.Item{}
	for _, v := range m {
		items = append(items, &pb.Item{
			Id:         v.Id,
			UserId:     v.UserId,
			Name:       v.Name,
			Note:       v.Note,
			Tags:       v.Tags,
			TagNames:   v.TagNames,
			Props:      v.Props,
			PropList:   *v.PropList,
			SoftDelete: v.SoftDelete,
			UpdatedAt:  timestamppb.New(v.UpdatedAt),
			UpdatedBy:  v.UpdatedBy,
		})
	}
	fmt.Printf("\n\n\n\n\nitems -  %+v\n\n\n\n\n", items[0])
	return items, nil
}

func ItemProtoToItemModel(msg []*pb.Item, genId bool) ([]*Item, []string, error) {
	items := []*Item{}
	check := map[string]bool{"name": true, "updated_by": true, "updated_at": true}

	for _, v := range msg {
		if v.GetUserId() == "" {
			return nil, nil, errors.New("no userId sent with request")
		}
		if v.GetName() == "" {
			return nil, nil, errors.New("no item name sent with request")
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
		if len(v.GetTagNames()) != 0 {
			newItem.TagNames = v.GetTagNames()
			check["tags_names"] = true
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
	for k, _ := range check {
		res = append(res, k)
	}
	return items, res, nil
}

func ItemProtoToItemModelPlus(msg []*pb.Item, genId bool) (*ItemUpsert, error) {
	items := []*Item{}
	check := map[string]bool{}
	checkTags := map[string]*Tag{}

	for _, v := range msg {
		if v.GetUserId() == "" {
			return nil, errors.New("no userId sent with request")
		}
		if v.GetName() == "" {
			return nil, errors.New("no filter name sent with request")
		}

		id := v.GetId()
		if id == "" && genId {
			id = uuid.Must(uuid.NewV7()).String()
		}
		newItem := &Item{
			Id:     id,
			UserId: v.GetUserId(),
		}

		// Set values that have not been set to nil
		if v.GetName() != "" {
			newItem.Name = v.GetName()
			check["name"] = true
		}
		if v.GetNote() != "" {
			newItem.Note = v.GetNote()
			check["note"] = true
		}
		if len(v.GetTags()) != 0 {
			newItem.Tags = v.GetTags()
			check["tags"] = true
			for _, tt := range v.GetTags() {
				// Get list of properties to attach to the tag
				prpl := []string{}
				for kp, _ := range v.GetProps() {
					prpl = append(prpl, kp)
				}
				if _, ok := checkTags[tt+"_"+v.GetUserId()]; !ok {
					checkTags[tt+"_"+v.GetUserId()] = &Tag{
						Id:     uuid.Must(uuid.NewV7()).String(),
						UserId: v.GetUserId(),
						Name:   tt,
						Props:  prpl,
					}
				} else {
					// Check if the properties of this tag needs to be extended
					// exTgs := append(checkTags[tt+"_"+v.GetUserId()].Props, prpl...)

					// Dedup extended tags
					nexTgs := map[string]bool{}
					for _, atg := range checkTags[tt+"_"+v.GetUserId()].Props {
						nexTgs[atg] = true
					}
					for _, atg := range prpl {
						nexTgs[atg] = true
					}

					// Create new deduped props list
					tagProps := []string{}
					for k, _ := range nexTgs {
						tagProps = append(tagProps, k)
					}

					// Update the props of the tag.
					checkTags[tt+"_"+v.GetUserId()].Props = tagProps
				}
			}
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
	for k, _ := range check {
		res = append(res, k)
	}

	// Get the fields that need to be updated for conflict resolution
	upTag := []Tag{}
	for _, v := range checkTags {
		upTag = append(upTag, *v)
	}

	i := ItemUpsert{
		Items:  &items,
		Update: res,
		Tags:   &upTag,
	}

	return &i, nil
}
