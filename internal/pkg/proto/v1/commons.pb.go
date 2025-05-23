// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.5
// 	protoc        (unknown)
// source: v1/commons.proto

package v1

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	timestamppb "google.golang.org/protobuf/types/known/timestamppb"
	reflect "reflect"
	sync "sync"
	unsafe "unsafe"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type AuditUpdaterEnum int32

const (
	AuditUpdaterEnum_AUDIT_UPDATER_ENUM_UNSPECIFIED AuditUpdaterEnum = 0
	AuditUpdaterEnum_AUDIT_UPDATER_ENUM_FRONTEND    AuditUpdaterEnum = 1
	AuditUpdaterEnum_AUDIT_UPDATER_ENUM_SYSOPS      AuditUpdaterEnum = 2
)

// Enum value maps for AuditUpdaterEnum.
var (
	AuditUpdaterEnum_name = map[int32]string{
		0: "AUDIT_UPDATER_ENUM_UNSPECIFIED",
		1: "AUDIT_UPDATER_ENUM_FRONTEND",
		2: "AUDIT_UPDATER_ENUM_SYSOPS",
	}
	AuditUpdaterEnum_value = map[string]int32{
		"AUDIT_UPDATER_ENUM_UNSPECIFIED": 0,
		"AUDIT_UPDATER_ENUM_FRONTEND":    1,
		"AUDIT_UPDATER_ENUM_SYSOPS":      2,
	}
)

func (x AuditUpdaterEnum) Enum() *AuditUpdaterEnum {
	p := new(AuditUpdaterEnum)
	*p = x
	return p
}

func (x AuditUpdaterEnum) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (AuditUpdaterEnum) Descriptor() protoreflect.EnumDescriptor {
	return file_v1_commons_proto_enumTypes[0].Descriptor()
}

func (AuditUpdaterEnum) Type() protoreflect.EnumType {
	return &file_v1_commons_proto_enumTypes[0]
}

func (x AuditUpdaterEnum) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use AuditUpdaterEnum.Descriptor instead.
func (AuditUpdaterEnum) EnumDescriptor() ([]byte, []int) {
	return file_v1_commons_proto_rawDescGZIP(), []int{0}
}

type Audit struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	CreatedBy     AuditUpdaterEnum       `protobuf:"varint,1,opt,name=created_by,proto3,enum=listah.v1.AuditUpdaterEnum" json:"created_by,omitempty"`
	CreatedAt     *timestamppb.Timestamp `protobuf:"bytes,2,opt,name=created_at,proto3" json:"created_at,omitempty"`
	UpdatedBy     AuditUpdaterEnum       `protobuf:"varint,50,opt,name=updated_by,proto3,enum=listah.v1.AuditUpdaterEnum" json:"updated_by,omitempty"`
	UpdatedAt     *timestamppb.Timestamp `protobuf:"bytes,51,opt,name=updated_at,proto3" json:"updated_at,omitempty"`
	DeletedBy     AuditUpdaterEnum       `protobuf:"varint,100,opt,name=deleted_by,proto3,enum=listah.v1.AuditUpdaterEnum" json:"deleted_by,omitempty"`
	DeletedAt     *timestamppb.Timestamp `protobuf:"bytes,101,opt,name=deleted_at,proto3" json:"deleted_at,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *Audit) Reset() {
	*x = Audit{}
	mi := &file_v1_commons_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *Audit) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Audit) ProtoMessage() {}

func (x *Audit) ProtoReflect() protoreflect.Message {
	mi := &file_v1_commons_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Audit.ProtoReflect.Descriptor instead.
func (*Audit) Descriptor() ([]byte, []int) {
	return file_v1_commons_proto_rawDescGZIP(), []int{0}
}

func (x *Audit) GetCreatedBy() AuditUpdaterEnum {
	if x != nil {
		return x.CreatedBy
	}
	return AuditUpdaterEnum_AUDIT_UPDATER_ENUM_UNSPECIFIED
}

func (x *Audit) GetCreatedAt() *timestamppb.Timestamp {
	if x != nil {
		return x.CreatedAt
	}
	return nil
}

func (x *Audit) GetUpdatedBy() AuditUpdaterEnum {
	if x != nil {
		return x.UpdatedBy
	}
	return AuditUpdaterEnum_AUDIT_UPDATER_ENUM_UNSPECIFIED
}

func (x *Audit) GetUpdatedAt() *timestamppb.Timestamp {
	if x != nil {
		return x.UpdatedAt
	}
	return nil
}

func (x *Audit) GetDeletedBy() AuditUpdaterEnum {
	if x != nil {
		return x.DeletedBy
	}
	return AuditUpdaterEnum_AUDIT_UPDATER_ENUM_UNSPECIFIED
}

func (x *Audit) GetDeletedAt() *timestamppb.Timestamp {
	if x != nil {
		return x.DeletedAt
	}
	return nil
}

type Pagination struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Offset        string                 `protobuf:"bytes,1,opt,name=offset,proto3" json:"offset,omitempty"`
	RecordsCount  int32                  `protobuf:"varint,2,opt,name=records_count,json=recordsCount,proto3" json:"records_count,omitempty"`
	Sorterr       []string               `protobuf:"bytes,3,rep,name=sorterr,proto3" json:"sorterr,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *Pagination) Reset() {
	*x = Pagination{}
	mi := &file_v1_commons_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *Pagination) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Pagination) ProtoMessage() {}

func (x *Pagination) ProtoReflect() protoreflect.Message {
	mi := &file_v1_commons_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Pagination.ProtoReflect.Descriptor instead.
func (*Pagination) Descriptor() ([]byte, []int) {
	return file_v1_commons_proto_rawDescGZIP(), []int{1}
}

func (x *Pagination) GetOffset() string {
	if x != nil {
		return x.Offset
	}
	return ""
}

func (x *Pagination) GetRecordsCount() int32 {
	if x != nil {
		return x.RecordsCount
	}
	return 0
}

func (x *Pagination) GetSorterr() []string {
	if x != nil {
		return x.Sorterr
	}
	return nil
}

var File_v1_commons_proto protoreflect.FileDescriptor

var file_v1_commons_proto_rawDesc = string([]byte{
	0x0a, 0x10, 0x76, 0x31, 0x2f, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x73, 0x2e, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x12, 0x09, 0x6c, 0x69, 0x73, 0x74, 0x61, 0x68, 0x2e, 0x76, 0x31, 0x1a, 0x1f, 0x67,
	0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2f, 0x74,
	0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0xf2,
	0x02, 0x0a, 0x05, 0x41, 0x75, 0x64, 0x69, 0x74, 0x12, 0x3b, 0x0a, 0x0a, 0x63, 0x72, 0x65, 0x61,
	0x74, 0x65, 0x64, 0x5f, 0x62, 0x79, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x1b, 0x2e, 0x6c,
	0x69, 0x73, 0x74, 0x61, 0x68, 0x2e, 0x76, 0x31, 0x2e, 0x41, 0x75, 0x64, 0x69, 0x74, 0x55, 0x70,
	0x64, 0x61, 0x74, 0x65, 0x72, 0x45, 0x6e, 0x75, 0x6d, 0x52, 0x0a, 0x63, 0x72, 0x65, 0x61, 0x74,
	0x65, 0x64, 0x5f, 0x62, 0x79, 0x12, 0x3a, 0x0a, 0x0a, 0x63, 0x72, 0x65, 0x61, 0x74, 0x65, 0x64,
	0x5f, 0x61, 0x74, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x67, 0x6f, 0x6f, 0x67,
	0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x54, 0x69, 0x6d, 0x65,
	0x73, 0x74, 0x61, 0x6d, 0x70, 0x52, 0x0a, 0x63, 0x72, 0x65, 0x61, 0x74, 0x65, 0x64, 0x5f, 0x61,
	0x74, 0x12, 0x3b, 0x0a, 0x0a, 0x75, 0x70, 0x64, 0x61, 0x74, 0x65, 0x64, 0x5f, 0x62, 0x79, 0x18,
	0x32, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x1b, 0x2e, 0x6c, 0x69, 0x73, 0x74, 0x61, 0x68, 0x2e, 0x76,
	0x31, 0x2e, 0x41, 0x75, 0x64, 0x69, 0x74, 0x55, 0x70, 0x64, 0x61, 0x74, 0x65, 0x72, 0x45, 0x6e,
	0x75, 0x6d, 0x52, 0x0a, 0x75, 0x70, 0x64, 0x61, 0x74, 0x65, 0x64, 0x5f, 0x62, 0x79, 0x12, 0x3a,
	0x0a, 0x0a, 0x75, 0x70, 0x64, 0x61, 0x74, 0x65, 0x64, 0x5f, 0x61, 0x74, 0x18, 0x33, 0x20, 0x01,
	0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x62, 0x75, 0x66, 0x2e, 0x54, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x52, 0x0a,
	0x75, 0x70, 0x64, 0x61, 0x74, 0x65, 0x64, 0x5f, 0x61, 0x74, 0x12, 0x3b, 0x0a, 0x0a, 0x64, 0x65,
	0x6c, 0x65, 0x74, 0x65, 0x64, 0x5f, 0x62, 0x79, 0x18, 0x64, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x1b,
	0x2e, 0x6c, 0x69, 0x73, 0x74, 0x61, 0x68, 0x2e, 0x76, 0x31, 0x2e, 0x41, 0x75, 0x64, 0x69, 0x74,
	0x55, 0x70, 0x64, 0x61, 0x74, 0x65, 0x72, 0x45, 0x6e, 0x75, 0x6d, 0x52, 0x0a, 0x64, 0x65, 0x6c,
	0x65, 0x74, 0x65, 0x64, 0x5f, 0x62, 0x79, 0x12, 0x3a, 0x0a, 0x0a, 0x64, 0x65, 0x6c, 0x65, 0x74,
	0x65, 0x64, 0x5f, 0x61, 0x74, 0x18, 0x65, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x67, 0x6f,
	0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x54, 0x69,
	0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x52, 0x0a, 0x64, 0x65, 0x6c, 0x65, 0x74, 0x65, 0x64,
	0x5f, 0x61, 0x74, 0x22, 0x63, 0x0a, 0x0a, 0x50, 0x61, 0x67, 0x69, 0x6e, 0x61, 0x74, 0x69, 0x6f,
	0x6e, 0x12, 0x16, 0x0a, 0x06, 0x6f, 0x66, 0x66, 0x73, 0x65, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x06, 0x6f, 0x66, 0x66, 0x73, 0x65, 0x74, 0x12, 0x23, 0x0a, 0x0d, 0x72, 0x65, 0x63,
	0x6f, 0x72, 0x64, 0x73, 0x5f, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x18, 0x02, 0x20, 0x01, 0x28, 0x05,
	0x52, 0x0c, 0x72, 0x65, 0x63, 0x6f, 0x72, 0x64, 0x73, 0x43, 0x6f, 0x75, 0x6e, 0x74, 0x12, 0x18,
	0x0a, 0x07, 0x73, 0x6f, 0x72, 0x74, 0x65, 0x72, 0x72, 0x18, 0x03, 0x20, 0x03, 0x28, 0x09, 0x52,
	0x07, 0x73, 0x6f, 0x72, 0x74, 0x65, 0x72, 0x72, 0x2a, 0x76, 0x0a, 0x10, 0x41, 0x75, 0x64, 0x69,
	0x74, 0x55, 0x70, 0x64, 0x61, 0x74, 0x65, 0x72, 0x45, 0x6e, 0x75, 0x6d, 0x12, 0x22, 0x0a, 0x1e,
	0x41, 0x55, 0x44, 0x49, 0x54, 0x5f, 0x55, 0x50, 0x44, 0x41, 0x54, 0x45, 0x52, 0x5f, 0x45, 0x4e,
	0x55, 0x4d, 0x5f, 0x55, 0x4e, 0x53, 0x50, 0x45, 0x43, 0x49, 0x46, 0x49, 0x45, 0x44, 0x10, 0x00,
	0x12, 0x1f, 0x0a, 0x1b, 0x41, 0x55, 0x44, 0x49, 0x54, 0x5f, 0x55, 0x50, 0x44, 0x41, 0x54, 0x45,
	0x52, 0x5f, 0x45, 0x4e, 0x55, 0x4d, 0x5f, 0x46, 0x52, 0x4f, 0x4e, 0x54, 0x45, 0x4e, 0x44, 0x10,
	0x01, 0x12, 0x1d, 0x0a, 0x19, 0x41, 0x55, 0x44, 0x49, 0x54, 0x5f, 0x55, 0x50, 0x44, 0x41, 0x54,
	0x45, 0x52, 0x5f, 0x45, 0x4e, 0x55, 0x4d, 0x5f, 0x53, 0x59, 0x53, 0x4f, 0x50, 0x53, 0x10, 0x02,
	0x42, 0x29, 0x5a, 0x27, 0x63, 0x6f, 0x72, 0x6e, 0x75, 0x63, 0x6f, 0x70, 0x69, 0x61, 0x2f, 0x6c,
	0x69, 0x73, 0x74, 0x61, 0x68, 0x2f, 0x69, 0x6e, 0x74, 0x65, 0x72, 0x6e, 0x61, 0x6c, 0x2f, 0x70,
	0x6b, 0x67, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x2f, 0x76, 0x31, 0x62, 0x06, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x33,
})

var (
	file_v1_commons_proto_rawDescOnce sync.Once
	file_v1_commons_proto_rawDescData []byte
)

func file_v1_commons_proto_rawDescGZIP() []byte {
	file_v1_commons_proto_rawDescOnce.Do(func() {
		file_v1_commons_proto_rawDescData = protoimpl.X.CompressGZIP(unsafe.Slice(unsafe.StringData(file_v1_commons_proto_rawDesc), len(file_v1_commons_proto_rawDesc)))
	})
	return file_v1_commons_proto_rawDescData
}

var file_v1_commons_proto_enumTypes = make([]protoimpl.EnumInfo, 1)
var file_v1_commons_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_v1_commons_proto_goTypes = []any{
	(AuditUpdaterEnum)(0),         // 0: listah.v1.AuditUpdaterEnum
	(*Audit)(nil),                 // 1: listah.v1.Audit
	(*Pagination)(nil),            // 2: listah.v1.Pagination
	(*timestamppb.Timestamp)(nil), // 3: google.protobuf.Timestamp
}
var file_v1_commons_proto_depIdxs = []int32{
	0, // 0: listah.v1.Audit.created_by:type_name -> listah.v1.AuditUpdaterEnum
	3, // 1: listah.v1.Audit.created_at:type_name -> google.protobuf.Timestamp
	0, // 2: listah.v1.Audit.updated_by:type_name -> listah.v1.AuditUpdaterEnum
	3, // 3: listah.v1.Audit.updated_at:type_name -> google.protobuf.Timestamp
	0, // 4: listah.v1.Audit.deleted_by:type_name -> listah.v1.AuditUpdaterEnum
	3, // 5: listah.v1.Audit.deleted_at:type_name -> google.protobuf.Timestamp
	6, // [6:6] is the sub-list for method output_type
	6, // [6:6] is the sub-list for method input_type
	6, // [6:6] is the sub-list for extension type_name
	6, // [6:6] is the sub-list for extension extendee
	0, // [0:6] is the sub-list for field type_name
}

func init() { file_v1_commons_proto_init() }
func file_v1_commons_proto_init() {
	if File_v1_commons_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: unsafe.Slice(unsafe.StringData(file_v1_commons_proto_rawDesc), len(file_v1_commons_proto_rawDesc)),
			NumEnums:      1,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_v1_commons_proto_goTypes,
		DependencyIndexes: file_v1_commons_proto_depIdxs,
		EnumInfos:         file_v1_commons_proto_enumTypes,
		MessageInfos:      file_v1_commons_proto_msgTypes,
	}.Build()
	File_v1_commons_proto = out.File
	file_v1_commons_proto_goTypes = nil
	file_v1_commons_proto_depIdxs = nil
}
