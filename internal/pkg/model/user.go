package model

import (
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
type Users []User

func (u *User) CreateUserModelFromRequest(ctx context.Context, msg *v1.UserServiceCreateOneRequest) {
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
func CreateManyUserModelFromRequest(ctx context.Context, msg *v1.UserServiceCreateManyRequest) *Users {
	_, span := otel.Tracer("category-model").Start(ctx, "prep create many request")
	defer span.End()

	c := Users{}
	for _, value := range msg.User {
		aCat := new(User)
		aCat.CreateUserModelFromRequest(ctx, value)
		c = append(c, *aCat)
	}
	return &c
}
func (u *User) UpdateUserModelFromRequest(ctx context.Context, msg *v1.UserServiceUpdateOneRequest, readUser *User) {
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
func UpdateManyUserModelFromRequest(ctx context.Context, msgs *v1.UserServiceUpdateManyRequest, readUser *Users) *Users {
	_, span := otel.Tracer("user-model").Start(ctx, "prep update request")
	defer span.End()

	users := Users{}

	for _, valReq := range msgs.User {
		for _, valRepo := range *readUser {
			if valRepo.Id == valReq.Id {
				u := User{}
				u.Id = valReq.GetId()
				u.FirstName = valReq.GetFirstName()
				u.MiddleNames = valReq.GetMiddleNames()
				u.LastName = valReq.GetLastName()
				u.Username = valReq.GetUsername()
				u.Email = valReq.GetEmail()
				u.Role = valReq.GetRole()
				u.Audit = Audit{
					CreatedBy: valRepo.Audit.CreatedBy,
					UpdatedBy: valReq.Audit.GetUpdatedBy(),
					DeletedBy: valRepo.Audit.DeletedBy,
					CreatedAt: valRepo.Audit.CreatedAt,
					UpdatedAt: time.Now().UTC(),
					DeletedAt: valRepo.Audit.DeletedAt,
				}

				// Set fields that were not included in the update request.
				if u.FirstName == "" {
					u.FirstName = valRepo.FirstName
				}

				if u.MiddleNames == "" {
					u.MiddleNames = valRepo.MiddleNames
				}

				if u.LastName == "" {
					u.LastName = valRepo.LastName
				}

				if u.Username == "" {
					u.Username = valRepo.Username
				}

				if u.Email == "" {
					u.Email = valRepo.Email
				}

				if u.Role == "" {
					u.Role = valRepo.Role
				}

				users = append(users, u)
			}
		}
	}
	return &users
}

func (u *User) DeleteUserModelFromRequest(ctx context.Context, msg *v1.UserServiceDeleteOneRequest, readUser *User) {
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

func (u *User) UserModelToResponse(ctx context.Context) *v1.UserServiceCreateOneResponse {
	_, span := otel.Tracer("user-model").Start(ctx, "user model to response")
	defer span.End()
	return &v1.UserServiceCreateOneResponse{
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

func (us *Users) ManyUserModelToResponse(ctx context.Context) *v1.UserServiceCreateManyResponse {
	_, span := otel.Tracer("category-model").Start(ctx, "user model to response")
	defer span.End()

	resValue := &v1.UserServiceCreateManyResponse{}
	for _, u := range *us {
		a := &v1.UserServiceCreateOneResponse{
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
		resValue.User = append(resValue.User, a)
	}
	return resValue
}
