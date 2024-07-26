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

func (u *User) CreateUserModelFromRequest(ctx context.Context, msg *pb.UserServiceCreateRequest) {
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
		CreatedBy: msg.Audit.GetCreatedBy(),
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		DeletedBy: msg.Audit.GetDeletedBy(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: msg.Audit.GetUpdatedAt().AsTime(),
		DeletedAt: msg.Audit.GetDeletedAt().AsTime(),
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
		CreatedBy: readUser.Audit.CreatedBy,
		UpdatedBy: msg.Audit.GetUpdatedBy(),
		DeletedBy: readUser.Audit.DeletedBy,
		CreatedAt: readUser.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(),
		DeletedAt: readUser.Audit.DeletedAt,
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

func (u *User) DeleteUserModelFromRequest(ctx context.Context, msg *pb.UserServiceDeleteRequest, readUser *User) {
	_, span := otel.Tracer("user-model").Start(ctx, "prep delete request")
	defer span.End()

	u.Id = readUser.Id
	u.FirstName = readUser.FirstName
	u.MiddleNames = readUser.MiddleNames
	u.LastName = readUser.LastName
	u.Username = readUser.Username
	u.Email = readUser.Email
	u.Role = readUser.Role
	u.Audit = Audit{

		CreatedBy: readUser.Audit.CreatedBy,
		UpdatedBy: msg.Audit.DeletedBy, //Set the updater to whomever is deleting the reocord
		DeletedBy: msg.Audit.DeletedBy,
		CreatedAt: readUser.Audit.CreatedAt,
		UpdatedAt: time.Now().UTC(), //Set the record to recently updated
		DeletedAt: time.Now().UTC(),
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
			UpdatedBy: u.Audit.UpdatedBy,
			DeletedBy: u.Audit.DeletedBy,
			UpdatedAt: timestamppb.New(u.Audit.UpdatedAt),
			CreatedAt: timestamppb.New(u.Audit.CreatedAt),
			DeletedAt: timestamppb.New(u.Audit.DeletedAt),
		},
	}
}
