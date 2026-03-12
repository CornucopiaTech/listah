package v1

// import (
// 	"fmt"
// 	"context"
// 	v1model "cornucopia/listah/internal/pkg/model/v1"
// 	pb "cornucopia/listah/internal/pkg/proto/v1"
// 	"github.com/pkg/errors"
// 	"connectrpc.com/connect"
// 	"go.opentelemetry.io/otel"
// 	// "go.mongodb.org/mongo-driver/v2/bson"
// )


// func (s *Server) ReadItem(ctx context.Context, req *connect.Request[pb.ItemServiceReadItemRequest]) (*connect.Response[pb.ItemServiceReadItemResponse], error) {
// 	rpcName := "Update"
// 	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

// 	ctx, span := otel.Tracer("item-service").Start(ctx, "read")
// 	defer span.End()
// 	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

// 	// Read model for repository
// 	imod, err :=  v1model.ReadItemQueryFromRequest(req.Msg)
// 	if err != nil {
// 		s.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for insertion", errors.Cause(err).Error())
// 		return nil, err
// 	}
// 	fmt.Printf("\n\n\n\nReadd Item Mode: %+v\n\n\n\n", imod[0])

// 	// Insert model in repository
// 	iId, err := s.MongoRepo.Item.Insert(ctx, imod)
// 	if err != nil {
// 		s.Logger.LogError(ctx, svcName, rpcName, "Repository  insertion error", errors.Cause(err).Error())
// 		return nil, err
// 	}
// 	s.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository insertion. Writing response")
// 	res := &pb.ItemServiceReadItemResponse{
// 		ItemIds: iId,
// 	}
// 	return connect.NewResponse(res), nil
// }
