package model

import (
	pb "cornucopia/listah/internal/pkg/proto/listah/v1"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"go.opentelemetry.io/otel"
	"golang.org/x/net/context"
)

type User struct {
	bun.BaseModel `bun:"table:app.users,alias:u"`
	Id            string `bun:",pk"`
	FirstName     string
	MiddleNames   string
	LastName      string
	Username      string
	Email         string
	Role          string
	Audit         Audit
}

func PrepCreateRequest(ctx context.Context, msg *pb.UserServiceCreateRequest) *User {
	_, span := otel.Tracer("users").Start(ctx, "prep create request")
	defer span.End()
	newUser := &User{
		Id:          uuid.Must(uuid.NewV7()).String(),
		FirstName:   msg.GetFirstName(),
		MiddleNames: msg.GetMiddleNames(),
		LastName:    msg.GetLastName(),
		Username:    msg.GetUsername(),
		Email:       msg.GetEmail(),
		Role:        msg.GetRole(),
		Audit: Audit{
			CreatedBy: msg.Audit.GetCreatedBy(),
			UpdatedBy: msg.Audit.GetUpdatedBy(),
			UpdatedAt: msg.Audit.UpdatedAt.AsTime(),
		},
	}

	return newUser

}

// func PrepCreateResponse(ctx context.Context, user *User) *pb.UserServiceCreateResponse {
// 	_, span := otel.Tracer("users").Start(ctx, "prep create request")
// 	defer span.End()
// 	return &pb.UserServiceCreateResponse{
// 		// req.Msg is a strongly-typed *pingv1.PingRequest, so we can access its
// 		// fields without type assertions.
// 		Id:          user.Id,
// 		FirstName:   user.FirstName,
// 		MiddleNames: user.MiddleNames,
// 		LastName:    user.LastName,
// 		Username:    user.Username,
// 		Email:       user.Email,
// 		Role:        user.Role,
// 		Audit: &v1.Audit{
// 			// CreatedBy: pb.AuditUpdaterEnum(pb.AuditUpdaterEnum_value[user.Audit.CreatedBy]),
// 			CreatedBy: pb.AuditUpdaterEnum(user.Audit.CreatedBy),
// 			CreatedAt: timestamppb.New(user.Audit.CreatedAt),
// 			UpdatedBy: pb.AuditUpdaterEnum(user.Audit.UpdatedBy),
// 			// UpdatedBy: pb.AuditUpdaterEnum(pb.AuditUpdaterEnum_value[user.Audit.UpdatedBy]),
// 			UpdatedAt: timestamppb.New(user.Audit.UpdatedAt),
// 		},
// 	}

// }
