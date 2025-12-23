package v1

import (
	"cornucopia/listah/internal/pkg/model"
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"time"
	// "fmt"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"errors"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type Item struct {
	bun.BaseModel `bun:"table:apps.items,alias:it"`
	Id            string `bun:",pk"`
	UserId        string
	Summary       string
	Category      string
	Description   string
	Note          string
	Tag          []string
	Properties    map[string]string
	SoftDelete    bool `bun:",nullzero,default:false"`
	ReactivateAt  time.Time
	Audit         Audit
}

var whereIndex = map[string]int {
	"Id":            0,
	"UserId":        1,
	"Summary":       2,
	"Category":      3,
	"Description":   4,
	"Note":          5,
}

var ItemConflictFields = []string{
	"id", "user_id",
}

var ItemResolveFields = []string{
	"summary", "category", "description", "note", "tag",
	"properties", "reactivate_at", "audit", "soft_delete",
	// "audit.updated_by", "audit.deleted_by",
	// "audit.updated_at", "audit.deleted_at",
}






func ItemProtoToItemModel(msg []*pb.Item, genId bool) ([]*Item, error) {
	items := []*Item{}
	for _, v := range msg {
		id := v.GetId()
		if id == "" && genId {
			id = uuid.Must(uuid.NewV7()).String()
		}
		items = append(items, &Item{
			Id:           id,
			UserId:       v.GetUserId(),
			Summary:      v.GetSummary(),
			Category:     v.GetCategory(),
			Description:  v.GetDescription(),
			Note:         v.GetNote(),
			Tag:         v.GetTag(),
			Properties:   v.GetProperties(),
			SoftDelete:   v.GetSoftDelete(),
			ReactivateAt: v.GetReactivateAt().AsTime(),
			Audit: Audit{
				CreatedBy: v.Audit.GetCreatedBy(),
				CreatedAt: v.Audit.GetCreatedAt().AsTime(),
				UpdatedBy: v.Audit.GetUpdatedBy(),
				UpdatedAt: v.Audit.GetUpdatedAt().AsTime(),
				DeletedBy: v.Audit.GetDeletedBy(),
				DeletedAt: v.Audit.GetDeletedAt().AsTime(),
			},
		})
	}
	return items, nil
}

func ItemProtoToItemModelUpsertSafe(msg []*pb.Item, genId bool) ([]*Item, error) {
	items := []*Item{}
	for _, v := range msg {
		id := v.GetId()
		if id == "" && genId {
			id = uuid.Must(uuid.NewV7()).String()
		}
		newItem := &Item{
			Id:           id,
			UserId:       v.GetUserId(),
				Audit: Audit{
				CreatedBy: v.Audit.GetCreatedBy(),
				CreatedAt: v.Audit.GetCreatedAt().AsTime(),
				UpdatedBy: v.Audit.GetUpdatedBy(),
				UpdatedAt: v.Audit.GetUpdatedAt().AsTime(),
				DeletedBy: v.Audit.GetDeletedBy(),
				DeletedAt: v.Audit.GetDeletedAt().AsTime(),
			},
		}

		// Set values that have not been set to nil
		if (v.GetSummary() != ""){
			newItem.Summary = v.GetSummary()
		}
		if (v.GetCategory() != ""){
			newItem.Category = v.GetCategory()
		}
		if (v.GetDescription() != ""){
			newItem.Description = v.GetDescription()
		}
		if (v.GetNote() != ""){
			newItem.Note = v.GetNote()
		}
		if (len(v.GetTag()) != 0){
			newItem.Tag = v.GetTag()
		}
		if (len(v.GetProperties()) != 0){
			newItem.Properties = v.GetProperties()
		}
		if (v.GetReactivateAt() != nil){
			newItem.ReactivateAt = v.GetReactivateAt().AsTime()
		}
		if (v.GetSoftDelete()){
			newItem.SoftDelete = v.GetSoftDelete()
		}

		items = append(items, newItem)
	}
	return items, nil
}

func ItemModelToItemProto(m []*Item) ([]*pb.Item, error) {
	items := []*pb.Item{}
	for _, v := range m {
		items = append(items, &pb.Item{
			Id:           v.Id,
			UserId:       v.UserId,
			Summary:      v.Summary,
			Category:     v.Category,
			Description:  &v.Description,
			Note:         &v.Note,
			Tag:         v.Tag,
			Properties:   v.Properties,
			SoftDelete:   &v.SoftDelete,
			ReactivateAt: timestamppb.New(v.ReactivateAt),
			Audit: &pb.Audit{
				CreatedBy: v.Audit.CreatedBy,
				CreatedAt: timestamppb.New(v.Audit.CreatedAt),
				UpdatedBy: v.Audit.UpdatedBy,
				UpdatedAt: timestamppb.New(v.Audit.UpdatedAt),
				DeletedBy: v.Audit.DeletedBy,
				DeletedAt: timestamppb.New(v.Audit.DeletedAt),
			},
		})
	}
	return items, nil
}

func ItemProtoToWhereClause(msg *pb.ItemServiceReadRequest) ([]model.WhereClause, error) {
	if len(msg.GetUserId()) == 0 {
		return nil, errors.New("No userId sent with request")
	}

	w := []model.WhereClause{}


	// ToDo: add search text, from date, to date
	// ToDo: allow admin to filter by other users' items
	// Add userId to where clause
	if msg.GetUserId() != "" {
		w = append(w, model.WhereClause{
			Placeholder: "? = ?",
			Column:      "user_id",
			Value:       msg.GetUserId(),
		})
	}



	// Add category to where clause
	if len(msg.GetCategory()) != 0 {
		w = append(w, model.WhereClause{
			Placeholder: "? IN (?)",
			Column:      "category",
			Value:       bun.In(msg.GetCategory()),
		})
	}


	// // tag
	// if len(msg.GetTag()) != 0 {
	// 	w = append(w, model.WhereClause{
	// 		Placeholder: "? IN (?)",
	// 		Column:      "tag",
	// 		Value:       bun.In(msg.GetTag()),
	// 	})
	// }

	// // properties
	// if len(msg.GetProperties()) != 0 {
	// 	for k, v := range msg.GetProperties() {
	// 		w = append(w, model.WhereClause{
	// 			Placeholder: fmt.Sprintf("?::VARCHAR = ?::VARCHAR"),
	// 			Column:      fmt.Sprintf("properties ->> '%s'", k),
	// 			Value:       v,
	// 		})
	// 	}
	// }

	// softDelete
	w = append(w, model.WhereClause{
		Placeholder: "? = ? ",
		Column:      "soft_delete",
		Value:       false,
	})

	return w, nil
}
