package v1

import (
	"cornucopia/listah/apps/api/internal/pkg/model"
	pb "cornucopia/listah/apps/api/internal/pkg/proto/v1"
	"time"
	"strings"
	"fmt"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"errors"
	"google.golang.org/protobuf/types/known/timestamppb"
)


type Item struct {
	bun.BaseModel `bun:"table:apps.items,alias:it"`
	Id            string `bun:",pk"`
	UserId        string
	Title       string
	Description   string
	Note          string
	Tag          []string `bun:"type:jsonb"`
	SoftDelete    bool `bun:",nullzero,default:false"`
	ReactivateAt  time.Time
}

type Category struct {
	Category        string
	RowCount int
}

type ReadPagination struct {
	PageNumber int32
	PageSize int32
	SortCondition string
}


var svcName string = "listah.v1.ItemService"
var ItemConflictFields = []string{
	"id", "user_id",
}
var defaultReadPagination = ReadPagination {
	PageNumber: 1,
	PageSize: 100,
	SortCondition: "user_id ASC, title ASC",
}



func MsgToItemSearch(msg *pb.ItemServiceReadItemRequest) (*model.ItemSearch, error) {
	if msg.GetUserId() == "" {
		return nil, errors.New("no userId sent with request")
	}
	pSize := int(msg.GetPageSize())
	pNum := int(msg.GetPageNumber())
	sortT := msg.GetSortQuery()

	if pSize <= 0 {
		pSize = int(defaultReadPagination.PageSize)
	}
	if pNum <= 0 {
		pNum = int(defaultReadPagination.PageNumber)
	}
	if sortT == "" {
		sortT = defaultReadPagination.SortCondition
	}
	offset := pSize * (pNum - 1)

	s := []string{}
	for _, v := range msg.GetFilter() {
		s = append(s, fmt.Sprintf(`'%v'`, v),)
	}


	i := model.ItemSearch{
		UserId: msg.GetUserId(),
		Filter: strings.Join(s, ", "),
		SearchQuery: msg.GetSearchQuery(),
		SortQuery: sortT,
		Limit: pSize,
		Offset: offset,
		PageNumber: pNum,
	}
	return &i, nil
}

func ItemModelToItemProto(m []*Item) ([]*pb.Item, error) {
	items := []*pb.Item{}
	for _, v := range m {
		items = append(items, &pb.Item{
			Id:           v.Id,
			UserId:       v.UserId,
			Title:      v.Title,
			Description:  &v.Description,
			Note:         &v.Note,
			Tag:         v.Tag,
			SoftDelete:   &v.SoftDelete,
			ReactivateAt: timestamppb.New(v.ReactivateAt),
		})
	}
	return items, nil
}

func CategoryModelToCategoryProto(m []*Category) ([]*pb.Category, error) {
	c := []*pb.Category{}
	for _, v := range m {
		c = append(c, &pb.Category{
				Category: v.Category,
				RowCount: int32(v.RowCount),
		})
	}
	return c, nil
}

func ItemProtoToItemModel(msg []*pb.Item, genId bool) ([]*Item, []string, error) {
	items := []*Item{}

	check :=  map[string]bool{}
	for _, v := range msg {
		id := v.GetId()
		if id == "" && genId {
			id = uuid.Must(uuid.NewV7()).String()
		}
		newItem := &Item{
			Id:           id,
			UserId:       v.GetUserId(),
		}

		// Set values that have not been set to nil
		if (v.GetTitle() != ""){
			newItem.Title = v.GetTitle()
			check["title"] = true
		}
		if (v.GetDescription() != ""){
			newItem.Description = v.GetDescription()
			check["description"] = true
		}
		if (v.GetNote() != ""){
			newItem.Note = v.GetNote()
			check["note"] = true
		}
		if (len(v.GetTag()) != 0){
			newItem.Tag = v.GetTag()
			check["tag"] = true
		}
		if (v.GetReactivateAt() != nil){
			newItem.ReactivateAt = v.GetReactivateAt().AsTime()
			check["reactivate_at"] = true
		}
		if (v.GetSoftDelete()){
			newItem.SoftDelete = v.GetSoftDelete()
			check["soft_delete"] = true
		}
		items = append(items, newItem)
	}

	res := []string{}
	for k,_ := range check{
		res = append(res, k)
	}

	return items, res, nil
}
