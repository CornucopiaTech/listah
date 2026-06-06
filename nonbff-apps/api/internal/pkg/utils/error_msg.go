package utils

import (
	"connectrpc.com/connect"
	"github.com/pkg/errors"

	pb "cornucopia/listah/internal/pkg/proto/v1"
	model "cornucopia/listah/internal/pkg/model/v1"
)


func HandleError(e error) *connect.Error{
	if errors.Is(e, model.DuplicateName) {
		return duplicateName()
	}
	if errors.Is(e, model.MissingUserId) {
		return missingUserId()
	}
	if errors.Is(e, model.MissingName) {
		return missingName()
	}
	if errors.Is(e, model.MissingTags) {
		return missingTags()
	}
	if errors.Is(e, model.MissingProps) {
		return missingProps()
	}

	return connect.NewError(connect.CodeInternal, errors.New("Internal error occurred. Please try again."))
}

func addDetails(d *pb.BadRequestDetails, cr *connect.Error) {
	// 3. Attach the Protobuf detail.
	// connect-go automatically handles the base64 JSON translation under the hood.
	if dwf, dErr := connect.NewErrorDetail(d); dErr == nil {
		cr.AddDetail(dwf)
	}
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
