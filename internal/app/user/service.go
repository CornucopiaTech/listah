package user

import (
	v1connect "cornucopia/listah/internal/pkg/proto/listah/v1/v1connect"
)

type Server struct {
	v1connect.UnimplementedUserServiceHandler
}
