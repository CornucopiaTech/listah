package v1

import (
	pb "cornucopia/listah/internal/pkg/proto/v1"
	"time"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"google.golang.org/protobuf/types/known/timestamppb"
	"cornucopia/listah/internal/pkg/model"
	"errors"
)

type Item struct {
	bun.BaseModel `bun:"table:apps.items,alias:it"`
	Id            string `bun:",pk"`
	UserId          string
	Summary  string
	Category          string
	Description string
	Note string
	Tags []string
	Properties map[string]string
	ReactivateAt   time.Time
	Audit interface{}
}


func ItemProtoToUpsert(p *pb.ItemServiceCreateRequest, t string) (*model.UpsertInfo, error) {
	// Update category model
	if (p.GetUserId() == ""){
		return nil, errors.New("No userId sent with request")
	}
	if (t =="update" && p.GetId() == ""){
		return nil, errors.New("No id sent with request")
	}
	w := model.UpsertInfo{
		Conflict: []string{"id", "user_id"},
		Resolve: []string{},
	}

	// Add summary to where clause
	if (p.GetSummary() != ""){
		w.Resolve = append(w.Resolve, "summary")
	}
	// Add category to where clause
	if (p.GetCategory() != ""){
		w.Resolve = append(w.Resolve, "category")
	}

	// description
	if (p.GetDescription() != ""){
		w.Resolve = append(w.Resolve, "description")
	}

	// note
	if (p.GetNote() != ""){
		w.Resolve = append(w.Resolve, "note")
	}

	// Tags
	if (len(p.GetTags()) != 0){
		w.Resolve = append(w.Resolve, "tags")
	}

	// Properties
	if (len(p.GetProperties()) != 0){
		w.Resolve = append(w.Resolve, "properties")
	}

		// Add expiration to where clause
		if (p.GetReactivateAt() != nil){
			w.Resolve = append(w.Resolve, "reactivate_at")
		}
	return &w, nil
}


func ItemProtoToWhereClause(p *pb.ItemServiceReadRequest) ([]model.WhereClause, error) {
	// Update category model
	if (p.GetUserId() == ""){
		return nil, errors.New("No userId sent with request")
	}
	w := []model.WhereClause{
		model.WhereClause{
			Placeholder: "? = ?",
			Column: "user_id",
			Value: p.UserId,
		},
	}

	// Add summary to where clause
	if (p.GetSummary() != ""){
		w = append(w, model.WhereClause{
			Placeholder: "? = ?",
			Column: "summary",
			Value: p.Summary,
		})
	}
	// Add category to where clause
	if (p.GetCategory() != ""){
		w = append(w, model.WhereClause{
			Placeholder: "? = ?",
			Column: "category",
			Value: p.Category,
		})
	}

	// description
	if (p.GetDescription() != ""){
		w = append(w, model.WhereClause{
			Placeholder: "? = ?",
			Column: "description",
			Value: p.Description,
		})
	}

	// note
	if (p.GetNote() != ""){
		w = append(w, model.WhereClause{
			Placeholder: "? = ?",
			Column: "note",
			Value: p.Note,
		})
	}

	// Tags
	if (len(p.GetTags()) != 0){
		w = append(w, model.WhereClause{
			Placeholder: "? = ?",
			Column: "tags",
			Value: p.Tags,
		})
	}

	// Properties
	if (len(p.GetProperties()) != 0){
		w = append(w, model.WhereClause{
			Placeholder: "? = ?",
			Column: "properties",
			Value: p.Properties,
		})
	}

		// Add expiration to where clause
		if (p.GetReactivateAt() != nil){
			w = append(w, model.WhereClause{
				Placeholder: "? > ?",
				Column: "reactivate_at",
				Value: p.ReactivateAt,
			})
		} else {
			w = append(w, model.WhereClause{
				Placeholder: "? <= to_timestamp(?, 'YYYY-MM-DD HH24-MI-SS')",
				Column: "reactivate_at",
				Value: time.Now().UTC().Format(time.DateTime),
			})
		}
	return w, nil
}

func (p *Item) ItemFromCreateRequest(msg *pb.ItemServiceCreateRequest) {
	// Update category model
	p.Id = uuid.Must(uuid.NewV7()).String()
	p.UserId = msg.GetUserId()
	p.Summary = msg.GetSummary()
	p.Category = msg.GetCategory()
	p.Description = msg.GetDescription()
	p.Note = msg.GetNote()
	p.Tags = msg.GetTags()
	p.Properties = msg.GetProperties()
	p.ReactivateAt = msg.GetReactivateAt().AsTime()
}

func (p *Item) ItemToCreateResponse() *pb.ItemServiceCreateResponse {
	return &pb.ItemServiceCreateResponse{
		Id:          p.Id,
		UserId:        p.UserId,
		Summary: p.Summary,
		Category:        p.Category,
		Description: p.Description,
		Note: p.Note,
		Tags: p.Tags,
		// Properties: map[string]interface{}p.Properties, //TODO
		ReactivateAt: timestamppb.New(p.ReactivateAt),
	}
}
