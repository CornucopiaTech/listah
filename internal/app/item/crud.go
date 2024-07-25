package item

import (
	"context"
	pb "cornucopia/listah/internal/pkg/proto/listah/v1"
	"log"

	"connectrpc.com/connect"
	"go.opentelemetry.io/otel"
	"go.uber.org/zap"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *Server) Read(ctx context.Context, req *connect.Request[pb.ItemServiceReadRequest]) (*connect.Response[pb.ItemServiceReadResponse], error) {
	// Create a span to track `childFunction()` - this is a nested span whose parent is `parentSpan`
	ctx, span := otel.Tracer("items").Start(ctx, "read")
	defer span.End()

	s.Infra.OtelLogger.Ctx(ctx).Info("Reading item", zap.String("item", req.Msg.Id))
	s.Infra.Logger.For(ctx).Info("Reading item", zap.String("item", req.Msg.Id))

	// ToDo: Implement Read Function
	res := connect.NewResponse(&pb.ItemServiceReadResponse{
		Id:           "Item Read Id1",
		Title:        "Item Read Title",
		Description:  "Item Read Description",
		Quantity:     "Item Read Quantity",
		Location:     "Item Read Location",
		Category:     "Item Read Category",
		Note:         "Item Read Note",
		ParentListId: "Item Read ParentListId",
		Active:       false,
		ReactivateAt: timestamppb.Now(),
	})
	res.Header().Set("Some-Other-Header", "hello!")
	return res, nil
}

func (s *Server) Create(ctx context.Context, req *connect.Request[pb.ItemServiceCreateRequest]) (*connect.Response[pb.ItemServiceCreateResponse], error) {
	ctx, span := otel.Tracer("items").Start(ctx, "create")
	defer span.End()

	s.Infra.OtelLogger.Ctx(ctx).Info("Creating item", zap.String("item", req.Msg.Id))
	s.Infra.Logger.For(ctx).Info("Creating item", zap.String("item", req.Msg.Id))

	// ToDo: Implement Read Function
	res := connect.NewResponse(&pb.ItemServiceCreateResponse{
		// req.Msg is a strongly-typed *pingv1.PingRequest, so we can access its
		// fields without type assertions.
		Id:           req.Msg.Id,
		Title:        req.Msg.Title,
		Description:  req.Msg.Description,
		Quantity:     req.Msg.Quantity,
		Location:     req.Msg.Location,
		Category:     req.Msg.Category,
		Note:         req.Msg.Note,
		ParentListId: req.Msg.ParentListId,
		Active:       req.Msg.Active,
		ReactivateAt: req.Msg.ReactivateAt,
	})
	res.Header().Set("Some-Other-Header", "hello!")
	return res, nil
}

func (s *Server) Echo(ctx context.Context, req *connect.Request[pb.ItemServiceCreateRequest]) (*connect.Response[pb.ItemServiceCreateRequest], error) {
	// connect.Request and connect.Response give you direct access to headers and
	// trailers. No context-based nonsense!
	log.Println(req.Header().Get("Some-Header"))
	res := connect.NewResponse(&pb.ItemServiceCreateRequest{
		// req.Msg is a strongly-typed *pingv1.PingRequest, so we can access its
		// fields without type assertions.
		Id:           req.Msg.Id,
		Title:        req.Msg.Title,
		Description:  req.Msg.Description,
		Quantity:     req.Msg.Quantity,
		Location:     req.Msg.Location,
		Category:     req.Msg.Category,
		Note:         req.Msg.Note,
		ParentListId: req.Msg.ParentListId,
		Active:       req.Msg.Active,
		ReactivateAt: req.Msg.ReactivateAt,
	})
	res.Header().Set("Some-Other-Header", "hello!")
	return res, nil
}
