package v1

import (
	// "cornucopia/listah/internal/pkg/model"
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"time"
	// "strings"
	// "fmt"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	// "google.golang.org/protobuf/types/known/timestamppb"
	// "go.mongodb.org/mongo-driver/v2/bson"
)

type Item struct {
	ReactivateAt time.Time
	UpdatedBy    time.Time
	Properties   map[string]string
	Id           string `bson:"_id"`
	UserId       string
	Title        string
	UpdatedAt    string
	Tags         []string
}

// type ReadPagination struct {
// 	PageNumber int32
// 	PageSize int32
// 	SortCondition string
// }

// type RowCount struct {
// 	RowCount int
// }

// var svcName string = "listah.v1.ItemService"
// var ItemConflictFields = []string{
// 	"id", "user_id",
// }
// var defaultReadPagination = ReadPagination {
// 	PageNumber: 1,
// 	PageSize: 100,
// 	SortCondition: "title ASC",
// }

func UpsertItemModelFromRequest(msg *pb.ItemServiceUpsertItemRequest) ([]*Item, error) {
	c := []*Item{}
	for _, om := range msg.Items {
		if om.GetUserId() == "" {
			return nil, errors.New("no userId sent with request")
		}
		id := om.GetId()
		if id == "" {
			id = uuid.Must(uuid.NewV7()).String()
		}
		a := &Item{
			Id:           id,
			UserId:       om.GetUserId(),
			Title:        om.GetTitle(),
			Tags:         om.GetTags(),
			Properties:   om.GetProperties(),
			ReactivateAt: om.GetReactivateAt().AsTime(),
		}
		c = append(c, a)
	}
	return c, nil
}

// func ReadItemQueryFromRequest(msg *pb.ItemServiceReadItemRequest) ([]*Item, error) {
// 	if msg.GetUserId() == "" {
// 		return nil, errors.New("no userId sent with request")
// 	}
// 	filter := bson.D{}
// 	if msg.GetTags() != nil {
// 	}

// 	c := []*Item{}
// 	for _, om := range msg.Items {
// 		id := om.GetId()
// 		if id == "" {
// 			id = uuid.Must(uuid.NewV7()).String()
// 		}
// 		a := &Item{
// 			Id:           id,
// 			UserId:       om.GetUserId(),
// 			Title:        om.GetTitle(),
// 			Tags:         om.GetTags(),
// 			Properties:   om.GetProperties(),
// 			ReactivateAt: om.GetReactivateAt().AsTime(),
// 		}
// 		c = append(c, a)
// 	}
// 	return c, nil
// }
