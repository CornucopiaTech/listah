package v1

import (
	"cornucopia/listah/apps/api/internal/pkg/model"
	pb "cornucopia/listah/apps/api/internal/pkg/proto/v1"
	"time"
	// "fmt"
	// "github.com/uptrace/bun/dialect/pgdialect"
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
	Description   string
	Note          string
	Tag          []string `bun:"type:jsonb"`
	SoftDelete    bool `bun:",nullzero,default:false"`
	ReactivateAt  time.Time
	Audit         Audit
}


var ItemConflictFields = []string{
	"id", "user_id",
}

var ItemResolveFields = []string{
	"summary", "description", "note", "tag",
	"reactivate_at", "audit", "soft_delete",
	// "audit.updated_by", "audit.deleted_by",
	// "audit.updated_at", "audit.deleted_at",
}






func IItemToItemModel(msg []*pb.Item, genId bool) ([]*Item, error) {
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
			Description:  v.GetDescription(),
			Note:         v.GetNote(),
			Tag:         v.GetTag(),
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

func IItemToItemModelUpsertSafe(msg []*pb.Item, genId bool) ([]*Item, error) {
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
		if (v.GetDescription() != ""){
			newItem.Description = v.GetDescription()
		}
		if (v.GetNote() != ""){
			newItem.Note = v.GetNote()
		}
		if (len(v.GetTag()) != 0){
			newItem.Tag = v.GetTag()
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

func ItemModelToIItem(m []*Item) ([]*pb.Item, error) {
	items := []*pb.Item{}
	for _, v := range m {
		items = append(items, &pb.Item{
			Id:           v.Id,
			UserId:       v.UserId,
			Summary:      v.Summary,
			Description:  &v.Description,
			Note:         &v.Note,
			Tag:         v.Tag,
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

func IItemToWhereClause(msg *pb.ItemServiceReadRequest) ([]model.WhereClause, error) {
	if msg.GetUserId() == "" {
		return nil, errors.New("no userId sent with request")
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


	// tag
	if len(msg.GetFilter()) != 0 {
		w = append(w, model.WhereClause{
			Placeholder: "?::JSONB IN (?)",
			Column:      "tag",
			// Value:       bun.In(pgdialect.Array(msg.GetTagFilter())), //Not working
			Value:       bun.In(msg.GetFilter()),
			// Value:       pgdialect.Array(msg.GetTagFilter()),
		})
	}

	// // tag -- Not working
	// if len(msg.GetTagFilter()) != 0 {
	// 	w = append(w, model.WhereClause{
	// 		Placeholder: "? IN (?)",
	// 		Column:      "tag",
	// 		// Value:       bun.In(pgdialect.Array(msg.GetTagFilter())), //Not working
	// 		Value:       bun.In(pgdialect.Array(msg.GetTagFilter())),
	// 	})
	// }


	// softDelete
	w = append(w, model.WhereClause{
		Placeholder: "? = ? ",
		Column:      "soft_delete",
		Value:       false,
	})

	return w, nil
}
