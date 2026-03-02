package v1

import (
	pb "cornucopia/listah/apps/api/internal/pkg/proto/v1"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type SavedFilter struct {
	bun.BaseModel `bun:"table:apps.saved_filters,alias:sf"`
	Id            string `bun:",pk"`
	UserId        string
	Name       string
	Tags          []string `bun:"type:jsonb"`
	SavedFilters          []string `bun:"type:jsonb"`
}



func SavedFilterProtoToSavedFilterModel(msg []*pb.SavedFilter, genId bool) ([]*SavedFilter, []string, error) {
	savedFilters := []*SavedFilter{}

	check :=  map[string]bool{}
	for _, v := range msg {
		id := v.GetId()
		if id == "" && genId {
			id = uuid.Must(uuid.NewV7()).String()
		}
		newItem := &SavedFilter{
			Id:           id,
			UserId:       v.GetUserId(),
		}

		// Set values that have not been set to nil
		if (v.GetName() != ""){
			newItem.Name = v.GetName()
			check["name"] = true
		}
		if (len(v.GetTags()) != 0){
			newItem.Tags = v.GetTags()
			check["tags"] = true
		}
		if (len(v.GetSavedFilters()) != 0){
			newItem.SavedFilters = v.GetSavedFilters()
			check["saved_filters"] = true
		}

		savedFilters = append(savedFilters, newItem)
	}

	res := []string{}
	for k,_ := range check{
		res = append(res, k)
	}

	return savedFilters, res, nil
}
