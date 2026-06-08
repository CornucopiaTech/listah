package utils

import (
	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"strings"


	pb "cornucopia/listah/internal/pkg/proto/v1"
	model "cornucopia/listah/internal/pkg/model/v1"
)


func getError(e error, reqId string) *connect.Error{
	var err *connect.Error
	var em = e.Error()

	// strings.HasPrefix(header, "Bearer ")
	isAuthError := errors.Is(e, model.Unauthorised) ||
		strings.HasPrefix(em, model.InvalidJWTMsg) ||
		strings.HasPrefix(em, model.FailedJWKSLoadMsg) ||
		strings.HasPrefix(em, model.MissingTokenMsg)

	if (isAuthError) {
		err = unauthorised()
	} else if errors.Is(e, model.DuplicateName) {
		err = duplicateName()
	} else if errors.Is(e, model.MissingUserId) {
		err = missingUserId()
	} else if errors.Is(e, model.MissingName) {
		err = missingName()
	} else if errors.Is(e, model.MissingTags) {
		err = missingTags()
	} else if errors.Is(e, model.MissingProps) {
		err = missingProps()
	} else {
		err = connect.NewError(connect.CodeInternal, errors.New("Internal error occurred. Please try again."))
	}
	err.Meta().Set("X-Request-Id", reqId)

	return err
}

func addDetails(d *pb.BadRequestDetails, cr *connect.Error) {
	// 3. Attach the Protobuf detail.
	// connect-go automatically handles the base64 JSON translation under the hood.
	if dwf, dErr := connect.NewErrorDetail(d); dErr == nil {
		cr.AddDetail(dwf)
	}
}

func unauthorised() *connect.Error{
	// 1. Construct Protobuf error detail
	m := "Unable to authorised request. Please login and try again."
	d := &pb.BadRequestDetails{
		Code: pb.ErrorCode_UNAUTHORISED,
	}

	// 2. Create the base Connect error (Automatically sets HTTP 401)
	cr := connect.NewError(connect.CodeUnauthenticated, errors.New(m))
	addDetails(d, cr)
	return cr
}

func duplicateName() *connect.Error{
	// 1. Construct Protobuf error detail
	m := "Name provided is already in use."
	d := &pb.BadRequestDetails{
		Code: pb.ErrorCode_ALREADY_EXISTS,
		FieldViolations: []*pb.FieldViolation{
			{
				Field:       "name",
				Description: m,
			},
		},
	}

	// 2. Create the base Connect error (Automatically sets HTTP 409)
	cr := connect.NewError(connect.CodeAlreadyExists, errors.New(m))
	addDetails(d, cr)
	return cr
}

func missingUserId() *connect.Error{
	// 1. Construct Protobuf error detail
	m := "Unknown user. Please sign in"
	d := &pb.BadRequestDetails{
		Code: pb.ErrorCode_VALIDATION_FAILED,
		FieldViolations: []*pb.FieldViolation{
			{
				Field:       "userId",
				Description: m,
			},
		},
	}

	cr := connect.NewError(connect.CodeInvalidArgument, errors.New(m))
	addDetails(d, cr)
	return cr
}

func missingName() *connect.Error{
	// 1. Construct Protobuf error detail
	m := "Name is required."
	d := &pb.BadRequestDetails{
		Code: pb.ErrorCode_VALIDATION_FAILED,
		FieldViolations: []*pb.FieldViolation{
			{
				Field:       "name",
				Description: m,
			},
		},
	}

	cr := connect.NewError(connect.CodeInvalidArgument, errors.New(m))
	addDetails(d, cr)
	return cr
}

func missingTags() *connect.Error{
	// 1. Construct Protobuf error detail
	m := "At least one tag is required."
	d := &pb.BadRequestDetails{
		Code: pb.ErrorCode_VALIDATION_FAILED,
		FieldViolations: []*pb.FieldViolation{
			{
				Field:       "tags",
				Description: m,
			},
		},
	}

	cr := connect.NewError(connect.CodeInvalidArgument, errors.New(m))
	addDetails(d, cr)
	return cr
}

func missingProps() *connect.Error{
	// 1. Construct Protobuf error detail
	m := "At least one property is required."
	d := &pb.BadRequestDetails{
		Code: pb.ErrorCode_VALIDATION_FAILED,
		FieldViolations: []*pb.FieldViolation{
			{
				Field:       "props",
				Description: m,
			},
		},
	}

	cr := connect.NewError(connect.CodeInvalidArgument, errors.New(m))
	addDetails(d, cr)
	return cr
}
