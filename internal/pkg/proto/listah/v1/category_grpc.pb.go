// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.4.0
// - protoc             (unknown)
// source: listah/v1/category.proto

package v1

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.62.0 or later.
const _ = grpc.SupportPackageIsVersion8

const (
	CategoryService_CreateOne_FullMethodName  = "/listah.v1.CategoryService/CreateOne"
	CategoryService_CreateMany_FullMethodName = "/listah.v1.CategoryService/CreateMany"
	CategoryService_ReadOne_FullMethodName    = "/listah.v1.CategoryService/ReadOne"
	CategoryService_ReadMany_FullMethodName   = "/listah.v1.CategoryService/ReadMany"
	CategoryService_UpdateOne_FullMethodName  = "/listah.v1.CategoryService/UpdateOne"
	CategoryService_UpdateMany_FullMethodName = "/listah.v1.CategoryService/UpdateMany"
	CategoryService_DeleteOne_FullMethodName  = "/listah.v1.CategoryService/DeleteOne"
	CategoryService_DeleteMany_FullMethodName = "/listah.v1.CategoryService/DeleteMany"
	CategoryService_ListItems_FullMethodName  = "/listah.v1.CategoryService/ListItems"
)

// CategoryServiceClient is the client API for CategoryService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type CategoryServiceClient interface {
	CreateOne(ctx context.Context, in *CategoryServiceCreateOneRequest, opts ...grpc.CallOption) (*CategoryServiceCreateOneResponse, error)
	CreateMany(ctx context.Context, in *CategoryServiceCreateManyRequest, opts ...grpc.CallOption) (*CategoryServiceCreateManyResponse, error)
	ReadOne(ctx context.Context, in *CategoryServiceReadOneRequest, opts ...grpc.CallOption) (*CategoryServiceReadOneResponse, error)
	ReadMany(ctx context.Context, in *CategoryServiceReadManyRequest, opts ...grpc.CallOption) (*CategoryServiceReadManyResponse, error)
	UpdateOne(ctx context.Context, in *CategoryServiceUpdateOneRequest, opts ...grpc.CallOption) (*CategoryServiceUpdateOneResponse, error)
	UpdateMany(ctx context.Context, in *CategoryServiceUpdateManyRequest, opts ...grpc.CallOption) (*CategoryServiceUpdateManyResponse, error)
	DeleteOne(ctx context.Context, in *CategoryServiceDeleteOneRequest, opts ...grpc.CallOption) (*CategoryServiceDeleteOneResponse, error)
	DeleteMany(ctx context.Context, in *CategoryServiceDeleteManyRequest, opts ...grpc.CallOption) (*CategoryServiceDeleteManyResponse, error)
	ListItems(ctx context.Context, in *CategoryServiceListItemsRequest, opts ...grpc.CallOption) (*CategoryServiceListItemsResponse, error)
}

type categoryServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewCategoryServiceClient(cc grpc.ClientConnInterface) CategoryServiceClient {
	return &categoryServiceClient{cc}
}

func (c *categoryServiceClient) CreateOne(ctx context.Context, in *CategoryServiceCreateOneRequest, opts ...grpc.CallOption) (*CategoryServiceCreateOneResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(CategoryServiceCreateOneResponse)
	err := c.cc.Invoke(ctx, CategoryService_CreateOne_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *categoryServiceClient) CreateMany(ctx context.Context, in *CategoryServiceCreateManyRequest, opts ...grpc.CallOption) (*CategoryServiceCreateManyResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(CategoryServiceCreateManyResponse)
	err := c.cc.Invoke(ctx, CategoryService_CreateMany_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *categoryServiceClient) ReadOne(ctx context.Context, in *CategoryServiceReadOneRequest, opts ...grpc.CallOption) (*CategoryServiceReadOneResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(CategoryServiceReadOneResponse)
	err := c.cc.Invoke(ctx, CategoryService_ReadOne_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *categoryServiceClient) ReadMany(ctx context.Context, in *CategoryServiceReadManyRequest, opts ...grpc.CallOption) (*CategoryServiceReadManyResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(CategoryServiceReadManyResponse)
	err := c.cc.Invoke(ctx, CategoryService_ReadMany_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *categoryServiceClient) UpdateOne(ctx context.Context, in *CategoryServiceUpdateOneRequest, opts ...grpc.CallOption) (*CategoryServiceUpdateOneResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(CategoryServiceUpdateOneResponse)
	err := c.cc.Invoke(ctx, CategoryService_UpdateOne_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *categoryServiceClient) UpdateMany(ctx context.Context, in *CategoryServiceUpdateManyRequest, opts ...grpc.CallOption) (*CategoryServiceUpdateManyResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(CategoryServiceUpdateManyResponse)
	err := c.cc.Invoke(ctx, CategoryService_UpdateMany_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *categoryServiceClient) DeleteOne(ctx context.Context, in *CategoryServiceDeleteOneRequest, opts ...grpc.CallOption) (*CategoryServiceDeleteOneResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(CategoryServiceDeleteOneResponse)
	err := c.cc.Invoke(ctx, CategoryService_DeleteOne_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *categoryServiceClient) DeleteMany(ctx context.Context, in *CategoryServiceDeleteManyRequest, opts ...grpc.CallOption) (*CategoryServiceDeleteManyResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(CategoryServiceDeleteManyResponse)
	err := c.cc.Invoke(ctx, CategoryService_DeleteMany_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *categoryServiceClient) ListItems(ctx context.Context, in *CategoryServiceListItemsRequest, opts ...grpc.CallOption) (*CategoryServiceListItemsResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(CategoryServiceListItemsResponse)
	err := c.cc.Invoke(ctx, CategoryService_ListItems_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// CategoryServiceServer is the server API for CategoryService service.
// All implementations should embed UnimplementedCategoryServiceServer
// for forward compatibility
type CategoryServiceServer interface {
	CreateOne(context.Context, *CategoryServiceCreateOneRequest) (*CategoryServiceCreateOneResponse, error)
	CreateMany(context.Context, *CategoryServiceCreateManyRequest) (*CategoryServiceCreateManyResponse, error)
	ReadOne(context.Context, *CategoryServiceReadOneRequest) (*CategoryServiceReadOneResponse, error)
	ReadMany(context.Context, *CategoryServiceReadManyRequest) (*CategoryServiceReadManyResponse, error)
	UpdateOne(context.Context, *CategoryServiceUpdateOneRequest) (*CategoryServiceUpdateOneResponse, error)
	UpdateMany(context.Context, *CategoryServiceUpdateManyRequest) (*CategoryServiceUpdateManyResponse, error)
	DeleteOne(context.Context, *CategoryServiceDeleteOneRequest) (*CategoryServiceDeleteOneResponse, error)
	DeleteMany(context.Context, *CategoryServiceDeleteManyRequest) (*CategoryServiceDeleteManyResponse, error)
	ListItems(context.Context, *CategoryServiceListItemsRequest) (*CategoryServiceListItemsResponse, error)
}

// UnimplementedCategoryServiceServer should be embedded to have forward compatible implementations.
type UnimplementedCategoryServiceServer struct {
}

func (UnimplementedCategoryServiceServer) CreateOne(context.Context, *CategoryServiceCreateOneRequest) (*CategoryServiceCreateOneResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateOne not implemented")
}
func (UnimplementedCategoryServiceServer) CreateMany(context.Context, *CategoryServiceCreateManyRequest) (*CategoryServiceCreateManyResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateMany not implemented")
}
func (UnimplementedCategoryServiceServer) ReadOne(context.Context, *CategoryServiceReadOneRequest) (*CategoryServiceReadOneResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ReadOne not implemented")
}
func (UnimplementedCategoryServiceServer) ReadMany(context.Context, *CategoryServiceReadManyRequest) (*CategoryServiceReadManyResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ReadMany not implemented")
}
func (UnimplementedCategoryServiceServer) UpdateOne(context.Context, *CategoryServiceUpdateOneRequest) (*CategoryServiceUpdateOneResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateOne not implemented")
}
func (UnimplementedCategoryServiceServer) UpdateMany(context.Context, *CategoryServiceUpdateManyRequest) (*CategoryServiceUpdateManyResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateMany not implemented")
}
func (UnimplementedCategoryServiceServer) DeleteOne(context.Context, *CategoryServiceDeleteOneRequest) (*CategoryServiceDeleteOneResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteOne not implemented")
}
func (UnimplementedCategoryServiceServer) DeleteMany(context.Context, *CategoryServiceDeleteManyRequest) (*CategoryServiceDeleteManyResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteMany not implemented")
}
func (UnimplementedCategoryServiceServer) ListItems(context.Context, *CategoryServiceListItemsRequest) (*CategoryServiceListItemsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListItems not implemented")
}

// UnsafeCategoryServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to CategoryServiceServer will
// result in compilation errors.
type UnsafeCategoryServiceServer interface {
	mustEmbedUnimplementedCategoryServiceServer()
}

func RegisterCategoryServiceServer(s grpc.ServiceRegistrar, srv CategoryServiceServer) {
	s.RegisterService(&CategoryService_ServiceDesc, srv)
}

func _CategoryService_CreateOne_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CategoryServiceCreateOneRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CategoryServiceServer).CreateOne(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: CategoryService_CreateOne_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CategoryServiceServer).CreateOne(ctx, req.(*CategoryServiceCreateOneRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _CategoryService_CreateMany_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CategoryServiceCreateManyRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CategoryServiceServer).CreateMany(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: CategoryService_CreateMany_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CategoryServiceServer).CreateMany(ctx, req.(*CategoryServiceCreateManyRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _CategoryService_ReadOne_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CategoryServiceReadOneRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CategoryServiceServer).ReadOne(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: CategoryService_ReadOne_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CategoryServiceServer).ReadOne(ctx, req.(*CategoryServiceReadOneRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _CategoryService_ReadMany_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CategoryServiceReadManyRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CategoryServiceServer).ReadMany(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: CategoryService_ReadMany_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CategoryServiceServer).ReadMany(ctx, req.(*CategoryServiceReadManyRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _CategoryService_UpdateOne_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CategoryServiceUpdateOneRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CategoryServiceServer).UpdateOne(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: CategoryService_UpdateOne_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CategoryServiceServer).UpdateOne(ctx, req.(*CategoryServiceUpdateOneRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _CategoryService_UpdateMany_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CategoryServiceUpdateManyRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CategoryServiceServer).UpdateMany(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: CategoryService_UpdateMany_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CategoryServiceServer).UpdateMany(ctx, req.(*CategoryServiceUpdateManyRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _CategoryService_DeleteOne_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CategoryServiceDeleteOneRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CategoryServiceServer).DeleteOne(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: CategoryService_DeleteOne_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CategoryServiceServer).DeleteOne(ctx, req.(*CategoryServiceDeleteOneRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _CategoryService_DeleteMany_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CategoryServiceDeleteManyRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CategoryServiceServer).DeleteMany(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: CategoryService_DeleteMany_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CategoryServiceServer).DeleteMany(ctx, req.(*CategoryServiceDeleteManyRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _CategoryService_ListItems_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CategoryServiceListItemsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CategoryServiceServer).ListItems(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: CategoryService_ListItems_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CategoryServiceServer).ListItems(ctx, req.(*CategoryServiceListItemsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// CategoryService_ServiceDesc is the grpc.ServiceDesc for CategoryService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var CategoryService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "listah.v1.CategoryService",
	HandlerType: (*CategoryServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "CreateOne",
			Handler:    _CategoryService_CreateOne_Handler,
		},
		{
			MethodName: "CreateMany",
			Handler:    _CategoryService_CreateMany_Handler,
		},
		{
			MethodName: "ReadOne",
			Handler:    _CategoryService_ReadOne_Handler,
		},
		{
			MethodName: "ReadMany",
			Handler:    _CategoryService_ReadMany_Handler,
		},
		{
			MethodName: "UpdateOne",
			Handler:    _CategoryService_UpdateOne_Handler,
		},
		{
			MethodName: "UpdateMany",
			Handler:    _CategoryService_UpdateMany_Handler,
		},
		{
			MethodName: "DeleteOne",
			Handler:    _CategoryService_DeleteOne_Handler,
		},
		{
			MethodName: "DeleteMany",
			Handler:    _CategoryService_DeleteMany_Handler,
		},
		{
			MethodName: "ListItems",
			Handler:    _CategoryService_ListItems_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "listah/v1/category.proto",
}