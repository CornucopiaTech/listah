package model

import (
	"encoding/json"

	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/proto"
)

func MarshalCopy[T comparable](dst T, src T) error {
	srcJson, err := json.Marshal(src)
	if err != nil {
		return err
	}

	if err = json.Unmarshal(srcJson, dst); err != nil {
		return err
	}

	return nil
}

func MarshalCopyProto(src, dst proto.Message) error {
	srcJson, err := protojson.MarshalOptions{EmitUnpopulated: true, EmitDefaultValues: true}.Marshal(src)
	if err != nil {
		return err
	}
	proto.Reset(dst)

	err = protojson.UnmarshalOptions{DiscardUnknown: true}.Unmarshal(srcJson, dst)

	if err != nil {
		return err
	}

	return nil
}
