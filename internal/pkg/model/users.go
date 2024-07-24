package model

import (
	pb "cornucopia/listah/internal/pkg/proto/listah/v1"
	v1 "cornucopia/listah/internal/pkg/proto/listah/v1"
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"go.opentelemetry.io/otel"
	"golang.org/x/net/context"
	"google.golang.org/protobuf/types/known/timestamppb"
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

func (u *User) UserModelFromRequest(ctx context.Context, msg *pb.UserServiceCreateRequest) {
	_, span := otel.Tracer("user-model").Start(ctx, "prep create request")
	defer span.End()

	// Update user model
	u.Id = uuid.Must(uuid.NewV7()).String()
	u.FirstName = msg.GetFirstName()
	u.MiddleNames = msg.GetMiddleNames()
	u.LastName = msg.GetLastName()
	u.Username = msg.GetUsername()
	u.Email = msg.GetEmail()
	u.Role = msg.GetRole()
	u.Audit = Audit{
		CreatedAt: time.Now().UTC(),
		CreatedBy: msg.Audit.GetCreatedBy(),
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		UpdatedAt: msg.Audit.GetCreatedAt().AsTime(),
	}
}

func (u *User) UpdateUserModelFromRequest(ctx context.Context, msg *pb.UserServiceUpdateRequest, readUser *User) {
	_, span := otel.Tracer("user-model").Start(ctx, "prep update request")
	defer span.End()

	u.Id = msg.GetId()
	u.FirstName = msg.GetFirstName()
	u.MiddleNames = msg.GetMiddleNames()
	u.LastName = msg.GetLastName()
	u.Username = msg.GetUsername()
	u.Email = msg.GetEmail()
	u.Role = msg.GetRole()
	u.Audit = Audit{
		CreatedAt: msg.Audit.GetCreatedAt().AsTime(),
		CreatedBy: msg.Audit.GetCreatedBy(),
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		UpdatedAt: time.Now().UTC(),
	}

	// Set fields that were not included in the update request.
	if u.FirstName == "" {
		u.FirstName = readUser.FirstName
	}

	if u.MiddleNames == "" {
		u.MiddleNames = readUser.MiddleNames
	}

	if u.LastName == "" {
		u.LastName = readUser.LastName
	}

	if u.Username == "" {
		u.Username = readUser.Username
	}

	if u.Email == "" {
		u.Email = readUser.Email
	}

	if u.Role == "" {
		u.Role = readUser.Role
	}

}

func (u *User) UserModelToResponse(ctx context.Context) *pb.UserServiceCreateResponse {
	_, span := otel.Tracer("user-model").Start(ctx, "user model to response")
	defer span.End()
	return &pb.UserServiceCreateResponse{
		// req.Msg is a strongly-typed *pingv1.PingRequest, so we can access its
		// fields without type assertions.
		Id:          u.Id,
		FirstName:   u.FirstName,
		MiddleNames: u.MiddleNames,
		LastName:    u.LastName,
		Username:    u.Username,
		Email:       u.Email,
		Role:        u.Role,
		Audit: &v1.Audit{
			CreatedBy: u.Audit.CreatedBy,
			CreatedAt: timestamppb.New(u.Audit.CreatedAt),
			UpdatedBy: u.Audit.UpdatedBy,
			UpdatedAt: timestamppb.New(u.Audit.UpdatedAt),
		},
	}
}
