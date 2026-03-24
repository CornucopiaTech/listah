package v1

import (
	"context"
	"fmt"

	"connectrpc.com/connect"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.opentelemetry.io/otel"

	model "cornucopia/listah/internal/pkg/model/v1"
	pb "cornucopia/listah/internal/pkg/proto/v1"
)

func (s *Server) ReadItem(ctx context.Context, req *connect.Request[pb.ItemServiceReadItemRequest]) (*connect.Response[pb.ItemServiceReadItemResponse], error) {
	rpcName := "Read"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer("item-service").Start(ctx, "read")
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// Read model for repository
	// imod, pg, err := model.ReadItemQueryFromRequest(req.Msg)
	imod, pg, err := model.ReadCountItemQueryFromRequest(req.Msg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for read", errors.Cause(err).Error())
		return nil, err
	}
	// m := []*model.Item{}
	// m := []model.ItemReadResult{}
	var m []bson.M
	// Insert model in repository
	// err = s.MongoRepo.Item.Read(ctx, &m, imod.Filter)
	err = s.MongoRepo.Item.Read(ctx, &m, imod)
	fmt.Printf("\n\n %+v \n\n", m)
	// fmt.Printf("\n\n %+v \n\n", m[0]["results"])
	fmt.Printf("\n\n %+v \n\n", m[0]["totalCount"])
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository  read error", errors.Cause(err).Error())
		return nil, err
	}

	// rs, err := model.ItemModelToReadResponse(m[0].Results)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Unable to create response from model", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository read and result prep. Writing response")
	res := &pb.ItemServiceReadItemResponse{
		// Items: rs,
		Query: req.Msg.GetQuery(),
		Pagination: &pb.Pagination{
			PageSize:   pg.PageSize,
			PageNumber: pg.PageNumber,
			Sort:       pg.Sort,
		},
	}
	return connect.NewResponse(res), nil
}

// func (s *Server) ReadTag(ctx context.Context, req *connect.Request[pb.ItemServiceReadTagRequest]) (*connect.Response[pb.ItemServiceReadTagResponse], error) {
// 	rpcName := "Read"
// 	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

// 	ctx, span := otel.Tracer("item-service").Start(ctx, "read")
// 	defer span.End()
// 	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

// 	// Read model for repository
// 	imod, err := model.ReadItemQueryFromRequest(req.Msg)
// 	if err != nil {
// 		s.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for read", errors.Cause(err).Error())
// 		return nil, err
// 	}
// 	fmt.Printf("\n\n\n\nRead Item Mode: %+v\n\n\n\n", imod)

// 	m := []*model.Item{}
// 	// Insert model in repository
// 	err = s.MongoRepo.Item.Read(ctx, &m, imod.Filter)
// 	if err != nil {
// 		s.Logger.LogError(ctx, svcName, rpcName, "Repository  read error", errors.Cause(err).Error())
// 		return nil, err
// 	}

// 	rs, err := model.ItemModelToReadResponse(m)
// 	if err != nil {
// 		s.Logger.LogError(ctx, svcName, rpcName, "Unable to create response from model", errors.Cause(err).Error())
// 		return nil, err
// 	}
// 	s.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository read and result prep. Writing response")
// 	res := &pb.ItemServiceReadItemResponse{
// 		Items: rs,
// 	}
// 	return connect.NewResponse(res), nil
// }
