package v1

import (
	"cornucopia/listah/internal/pkg/model"
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"errors"
	"fmt"
	"strings"

	"github.com/google/uuid"
)

var svcName string = "listah.v1.ItemService"
var ItemConflictFields = []string{
	"id", "user_id",
}
var defaultPagination = model.Pagination{
	PageNumber: 1,
	PageSize:   100,
	Sort:       "name ASC",
}

func MsgToItemSearch(msg *pb.ItemServiceReadItemRequest) (*model.ItemSearch, error) {
	if msg.GetUserId() == "" {
		return nil, errors.New("no userId sent with request")
	}
	pSize := msg.GetPagination().PageSize
	pNum := msg.GetPagination().PageNumber
	sortT := msg.GetPagination().Sort

	if pSize <= 0 {
		pSize = defaultPagination.PageSize
	}
	if pNum <= 0 {
		pNum = defaultPagination.PageNumber
	}
	if sortT == "" {
		sortT = defaultPagination.Sort
	}
	offset := pSize * (pNum - 1)

	s := []string{}
	for _, v := range msg.GetQuery().Filters {
		s = append(s, fmt.Sprintf(`'%v'`, v))
	}

	t := []string{}
	for _, v := range msg.GetQuery().Tags {
		t = append(t, fmt.Sprintf(`'%v'`, v))
	}

	i := model.ItemSearch{
		UserId:      msg.GetUserId(),
		Tags:        strings.Join(t, ", "),
		Filters:     strings.Join(s, ", "),
		SearchQuery: msg.GetQuery().Text,
		SortQuery:   sortT,
		Limit:       pSize,
		Offset:      offset,
		PageNumber:  pNum,
	}
	return &i, nil
}

func ItemModelToItemProto(m []*model.Item) ([]*pb.Item, error) {
	items := []*pb.Item{}
	for _, v := range m {
		items = append(items, &pb.Item{
			Id:         v.Id,
			UserId:     v.UserId,
			Name:       v.Name,
			Note:       v.Note,
			Tags:       v.Tags,
			Props:      v.Props,
			SoftDelete: &v.SoftDelete,
		})
	}
	return items, nil
}

func ItemProtoToItemModel(msg []*pb.Item, genId bool) ([]*model.Item, []string, error) {
	items := []*model.Item{}

	check := map[string]bool{}
	for _, v := range msg {
		id := v.GetId()
		if id == "" && genId {
			id = uuid.Must(uuid.NewV7()).String()
		}
		newItem := &model.Item{
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
			check["tag"] = true
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

	res := []string{}
	for k, _ := range check {
		res = append(res, k)
	}

	return items, res, nil
}
