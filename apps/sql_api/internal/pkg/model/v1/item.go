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

	fmt.Printf("\n\n\n\n\npg -  %+v\n\n\n\n\n", pg);


	if pg != nil {
		if pg.PageSize > 0 {
			pSize = pg.PageSize
		}
		if pg.PageNumber != pNum {
			pNum = pg.PageNumber
		}
		if pg.Sort != sortT {
			sortT = pg.Sort
		}
	}

	offset := int64(0)
	if pSize > 0 && pNum > 0{
		offset = pSize * pNum
	}


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

	fmt.Printf("\n\n\n\n\nItemSearch -  %+v\n\n\n\n\n", i);
	return &i, nil
}

func ItemModelToItemProto(m []*Item) ([]*pb.Item, error) {
	items := []*pb.Item{}
	for _, v := range m {
		to := []*pb.Tag{}
		for _, iv := range v.TagObjs {
			to = append(to, &pb.Tag{
				Id:         iv.Id,
				UserId:     iv.UserId,
				Name:       iv.Name,
				Props:      iv.Props,
			})
		}
		mo := []*pb.MapObj{}
		for _, iv := range v.PropObjs {
			mo = append(mo, &pb.MapObj{
				Key:     iv.Key,
				Value:       iv.Value,
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
			TagObjs:   to,
			PropObjs: mo,
			UpdatedAt:  timestamppb.New(v.UpdatedAt),
			UpdatedBy:  v.UpdatedBy,
		})
	}

	if len(items) > 0 {
		fmt.Printf("\n\n\n\n\nitems -  %+v\n\n\n\n\n", items[0]);
	}

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
