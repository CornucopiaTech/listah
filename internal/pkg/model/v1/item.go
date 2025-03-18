package v1

import (
	"cornucopia/listah/internal/pkg/model"
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"errors"
	"strings"
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
	Tags          []string
	Properties    map[string]string
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


// func ItemProtoToUpsert(p *pb.ItemServiceCreateRequest, t string) (*model.UpsertInfo, error) {
// 	// Update category model
// 	if p.GetUserId() == "" {
// 		return nil, errors.New("No userId sent with request")
// 	}
// 	if t == "update" && p.GetId() == "" {
// 		return nil, errors.New("No id sent with request")
// 	}
// 	w := model.UpsertInfo{
// 		Conflict: []string{"id", "user_id"},
// 		Resolve:  []string{},
// 	}

// 	// Add summary to where clause
// 	if p.GetSummary() != "" {
// 		w.Resolve = append(w.Resolve, "summary")
// 	}
// 	// Add category to where clause
// 	if p.GetCategory() != "" {
// 		w.Resolve = append(w.Resolve, "category")
// 	}

// 	// description
// 	if p.GetDescription() != "" {
// 		w.Resolve = append(w.Resolve, "description")
// 	}

// 	// note
// 	if p.GetNote() != "" {
// 		w.Resolve = append(w.Resolve, "note")
// 	}

// 	// Tags
// 	if len(p.GetTags()) != 0 {
// 		w.Resolve = append(w.Resolve, "tags")
// 	}

// 	// Properties
// 	if len(p.GetProperties()) != 0 {
// 		w.Resolve = append(w.Resolve, "properties")
// 	}

// 	// Add expiration to where clause
// 	if p.GetReactivateAt() != nil {
// 		w.Resolve = append(w.Resolve, "reactivate_at")
// 	}
// 	return &w, nil
// }

func ItemProtoToWhereClauseBackup(msg []*pb.Item) ([]model.ItemWhereClause, error) {
	w := []model.ItemWhereClause{}
	for _, v := range msg {
		if v.GetUserId() == "" {
			return nil, errors.New("No userId sent with request")
		}

		// Add Id to where clause
		if v.GetId() != "" {
			if len(w) < whereIndex["Id"] + 1 {
				w = append(w, model.ItemWhereClause{
					Placeholder: "?::VARCHAR IN (?)",
					Column:      "id",
					Value:       []string{v.GetId()},
				})
			} else {
				w[whereIndex["Id"]].Value = append(w[whereIndex["Id"]].Value, v.GetId())
			}
		}

		// Add userId to where clause
		if v.GetUserId() != "" {
			if len(w) < whereIndex["UserId"] + 1 {
				w = append(w, model.ItemWhereClause{
					Placeholder: "? IN (?)",
					Column:      "user_id",
					Value:       []string{v.GetUserId()},
				})
			} else {
				w[whereIndex["UserId"]].Value = append(w[whereIndex["UserId"]].Value, v.GetUserId())
			}
		}

		// Add summary to where clause
		if v.GetSummary() != "" {
			if len(w) < whereIndex["Summary"] + 1 {
				w = append(w, model.ItemWhereClause{
					Placeholder: "? IN (?)",
					Column:      "summary",
					Value:       []string{v.GetSummary()},
				})
			} else {
				w[whereIndex["Summary"]].Value = append(w[whereIndex["Summary"]].Value, v.GetSummary())
			}
		}

		// Add category to where clause
		if v.GetCategory() != "" {
			if len(w) < whereIndex["Category"] + 1 {
				w = append(w, model.ItemWhereClause{
					Placeholder: "? IN (?)",
					Column:      "category",
					Value:       []string{v.GetCategory()},
				})
			} else {
				w[whereIndex["Category"]].Value = append(w[whereIndex["Category"]].Value, v.GetCategory())
			}
		}

		// description
		if v.GetDescription() != "" {
			if len(w) < whereIndex["Description"] + 1 {
				w = append(w, model.ItemWhereClause{
					Placeholder: "? IN (?)",
					Column:      "description",
					Value:       []string{v.GetDescription()},
				})
			} else {
				w[whereIndex["Description"]].Value = append(w[whereIndex["Description"]].Value, v.GetDescription())
			}
		}

		// note
		if v.GetNote() != "" {
			if len(w) < whereIndex["Note"] + 1 {
				w = append(w, model.ItemWhereClause{
					Placeholder: "? IN (?)",
					Column:      "note",
					Value:       []string{v.GetNote()},
				})
			} else {
				w[whereIndex["Note"]].Value = append(w[whereIndex["Note"]].Value, v.GetNote())
			}
		}
	}
	return w, nil
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
			Tags:         v.GetTags(),
			Properties:   v.GetProperties(),
			ReactivateAt: v.GetReactivateAt().AsTime(),
			Audit: Audit{
				CreatedBy: v.Audit.GetCreatedBy(),
				// CreatedAt: time.Now().UTC().Format(time.DateTime),
				CreatedAt: time.Now().UTC(),
				UpdatedBy: v.Audit.GetUpdatedBy(),
				// UpdatedAt: time.Now().UTC().Format(time.DateTime),
				UpdatedAt: time.Now().UTC(),
				DeletedBy: v.Audit.GetDeletedBy(),
				// DeletedAt: time.Now().UTC().Format(time.DateTime),
				DeletedAt: time.Now().UTC(),
			},
		})
	}
	return items, nil
}

func ItemModelToItemProto(msg []*Item) ([]*pb.Item, error) {
	items := []*pb.Item{}
	for _, v := range msg {
		items = append(items, &pb.Item{
			Id:           v.Id,
			UserId:       v.UserId,
			Summary:      v.Summary,
			Category:     v.Category,
			Description:  &v.Description,
			Note:         &v.Note,
			Tags:         v.Tags,
			Properties:   v.Properties,
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

func ItemProtoToWhereClause(msg []*pb.Item) ([]model.WhereClause, error) {
	i := []string{}
	u := []string{}
	s := []string{}
	c := []string{}
	d := []string{}
	n := []string{}

	for _, v := range msg {
		if v.GetUserId() == "" {
			return nil, errors.New("No userId sent with request")
		}

		// Add Id to where clause
		if v.GetId() != "" {
			i = append(i, v.GetId())
		}

		// Add userId to where clause
		if v.GetUserId() != "" {
			u = append(u, v.GetUserId())
		}

		// Add summary to where clause
		if v.GetSummary() != "" {
			s = append(s, v.GetSummary())
		}

		// Add category to where clause
		if v.GetCategory() != "" {
			c = append(c, v.GetCategory())
		}

		// description
		if v.GetDescription() != "" {
			d = append(d, v.GetDescription())
		}

		// note
		if v.GetNote() != "" {
			n = append(n, v.GetNote())
		}
	}

	w := []model.WhereClause{}
	// Add Id to where clause
	if len(i) != 0{
		w = append(w, model.WhereClause{
			Placeholder: "?::VARCHAR IN (?)",
			Column:      "id",
			Value:       strings.Join(i, ", "),
		})
	}

	// Add userId to where clause
	if len(u) != 0{
		w = append(w, model.WhereClause{
			Placeholder: "? IN (?)",
			Column:      "user_id",
			Value:       strings.Join(u, ", "),
		})
	}

	// Add summary to where clause
	if len(s) != 0{
		w = append(w, model.WhereClause{
			Placeholder: "? IN (?)",
			Column:      "summary",
			Value:       strings.Join(s, ", "),
		})
	}

	// Add category to where clause
	if len(c) != 0{
		w = append(w, model.WhereClause{
			Placeholder: "? IN (?)",
			Column:      "category",
			Value:       strings.Join(c, ", "),
		})
	}

	// description
	if len(d) != 0{
		w = append(w, model.WhereClause{
			Placeholder: "? IN (?)",
			Column:      "description",
			Value:       strings.Join(d, ", "),
		})
	}

	// note
	if len(n) != 0{
		w = append(w, model.WhereClause{
			Placeholder: "? IN (?)",
			Column:      "note",
			Value:       strings.Join(n, ", "),
		})
	}

	return w, nil
}

// func ItemFromCreateRequest(msg []*pb.Item) ([]*Item, error) {
// 	items := []*Item{}
// 	for _, v := range msg {
// 		id := v.GetId()
// 		if id == ""{
// 			id = uuid.Must(uuid.NewV7()).String()
// 		}
// 		items = append(items, &Item{
// 			Id:           id,
// 			UserId:       v.GetUserId(),
// 			Summary:      v.GetSummary(),
// 			Category:     v.GetCategory(),
// 			Description:  v.GetDescription(),
// 			Note:         v.GetNote(),
// 			Tags:         v.GetTags(),
// 			Properties:   v.GetProperties(),
// 			ReactivateAt: v.GetReactivateAt().AsTime(),
// 			// Audit:        v.GetAudit(),
// 			Audit: Audit{
// 				CreatedBy: "AUDIT_UPDATER_ENUM_UNSPECIFIED",
// 				// CreatedAt: time.Now().UTC().Format(time.DateTime),
// 				CreatedAt: time.Now().UTC(),
// 				UpdatedBy: "AUDIT_UPDATER_ENUM_FRONTEND",
// 				// UpdatedAt: time.Now().UTC().Format(time.DateTime),
// 				UpdatedAt: time.Now().UTC(),
// 				DeletedBy: "AUDIT_UPDATER_ENUM_SYSOPS",
// 				// DeletedAt: time.Now().UTC().Format(time.DateTime),
// 				DeletedAt: time.Now().UTC(),
// 			},
// 		})
// 	}
// 	return items, nil
// }

// func (p *Item) ItemToCreateResponse() *pb.ItemServiceCreateResponse {
// 	return &pb.ItemServiceCreateResponse{
// 		Id:          p.Id,
// 		UserId:      p.UserId,
// 		Summary:     p.Summary,
// 		Category:    p.Category,
// 		Description: p.Description,
// 		Note:        p.Note,
// 		Tags:        p.Tags,
// 		// Properties: map[string]interface{}p.Properties, //TODO
// 		ReactivateAt: timestamppb.New(p.ReactivateAt),
// 	}
// }
