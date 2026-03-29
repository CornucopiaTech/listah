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

func (s *Server) PrevReadItem(ctx context.Context, req *connect.Request[pb.ItemServiceReadItemRequest]) (*connect.Response[pb.ItemServiceReadItemResponse], error) {
	rpcName := "Read"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer("item-service").Start(ctx, "read")
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// Read model for repository
	imod, pg, err := model.ReadCountItemQueryFromRequest(req.Msg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for read", errors.Cause(err).Error())
		return nil, err
	}

	var m []bson.M
	// Insert model in repository
	err = s.MongoRepo.Item.Read(ctx, &m, imod)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository  read error", errors.Cause(err).Error())
		return nil, err
	}

	fmt.Printf("\n\nm %+v \n\n", m)
	fmt.Printf("\n\n %+v \n\n", m[0]["results"])
	fmt.Printf("\n\nm[0][totalCount] %+v \n\n", m[0]["totalCount"])
	r := m[0]["results"].(bson.A)
	if len(r) == 0 {
		rs := []*pb.Item{}
		res := &pb.ItemServiceReadItemResponse{
			Items:            rs,
			TotalRecordCount: 0,
			Query:            req.Msg.GetQuery(),
			Pagination: &pb.Pagination{
				PageSize:   pg.PageSize,
				PageNumber: pg.PageNumber,
				Sort:       pg.Sort,
			},
		}
		return connect.NewResponse(res), nil
	}

	tc := m[0]["totalCount"].(bson.A)[0].(bson.D)
	ds, err := bson.Marshal(tc)
	var tm bson.M
	err = bson.Unmarshal(ds, &tm)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Bson document marshalling error", errors.Cause(err).Error())
		return nil, err
	}

	fmt.Printf("\n\nm[0][totalCount][0] %+v \n\n", tc)
	fmt.Printf("\n\ntm[count] %+v \n\n", tm["count"])

	// rs, err := model.ItemModelToReadItemResponse(m[0].Results)
	rs, err := model.BsonMapListToReadItemResponse(r)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Unable to create response from model", errors.Cause(err).Error())
		return nil, err
	}
	s.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository read and result prep. Writing response")
	res := &pb.ItemServiceReadItemResponse{
		Items:            rs,
		TotalRecordCount: tm["count"].(int32),
		Query:            req.Msg.GetQuery(),
		Pagination: &pb.Pagination{
			PageSize:   pg.PageSize,
			PageNumber: pg.PageNumber,
			Sort:       pg.Sort,
		},
	}
	return connect.NewResponse(res), nil
}

func (s *Server) ReadItem(ctx context.Context, req *connect.Request[pb.ItemServiceReadItemRequest]) (*connect.Response[pb.ItemServiceReadItemResponse], error) {
	rpcName := "Read"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer("item-service").Start(ctx, "read")
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// Read model for repository
	imod, pg, err := model.ReadCountItemQueryFromRequest(req.Msg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error getting item model for read", errors.Cause(err).Error())
		return nil, err
	}

	var m []bson.M
	// Insert model in repository
	err = s.MongoRepo.Item.Read(ctx, &m, imod)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository  read error", errors.Cause(err).Error())
		return nil, err
	}

	res, err := model.PrepareItemReadResponse(m, req.Msg, pg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Response parse error", errors.Cause(err).Error())
		return nil, err
	}
	return connect.NewResponse(res), nil
}

func (s *Server) ReadTag(ctx context.Context, req *connect.Request[pb.ItemServiceReadTagRequest]) (*connect.Response[pb.ItemServiceReadTagResponse], error) {
	rpcName := "Read"
	rpcLogName := fmt.Sprintf("POST /%v/%v", svcName, rpcName)

	ctx, span := otel.Tracer("item-service").Start(ctx, "read")
	defer span.End()
	s.Logger.LogInfo(ctx, svcName, rpcName, rpcLogName)

	// Read model for repository
	imod, pg, err := model.ReadCountTagQueryFromRequest(req.Msg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Error parsing message for tag read", errors.Cause(err).Error())
		return nil, err
	}

	var m []bson.M
	// Read model in repository
	err = s.MongoRepo.Tag.Read(ctx, &m, imod)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Repository read error", errors.Cause(err).Error())
		return nil, err
	}

	res, err := model.PrepareTagReadResponse(m, req.Msg, pg)
	if err != nil {
		s.Logger.LogError(ctx, svcName, rpcName, "Response parse error", errors.Cause(err).Error())
		return nil, err
	}

	s.Logger.LogInfo(ctx, svcName, rpcName, "Successful repository read and result prep. Writing response")
	return connect.NewResponse(res), nil
}
