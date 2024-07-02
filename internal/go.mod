module cornucopia/listah/internal

go 1.22.4

// require google.golang.org/protobuf v1.34.2

// require (
// 	github.com/grpc-ecosystem/grpc-gateway/v2 v2.20.0
// 	google.golang.org/grpc v1.64.0
// 	google.golang.org/grpc/cmd/protoc-gen-go-grpc v1.4.0
// )

// // require github.com/grpc-ecosystem/grpc-gateway/v2/runtime

// require (
// 	github.com/kr/text v0.2.0 // indirect
// 	github.com/rogpeppe/go-internal v1.12.0 // indirect
// 	golang.org/x/net v0.23.0 // indirect
// 	golang.org/x/sys v0.18.0 // indirect
// 	golang.org/x/text v0.15.0 // indirect
// 	google.golang.org/genproto/googleapis/api v0.0.0-20240513163218-0867130af1f8 // indirect
// 	google.golang.org/genproto/googleapis/rpc v0.0.0-20240513163218-0867130af1f8 // indirect
// 	gopkg.in/yaml.v3 v3.0.1 // indirect
// )

require (
	go.opentelemetry.io/contrib/bridges/otelslog v0.2.0
	go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp v0.52.0
	go.opentelemetry.io/otel v1.27.0
	go.opentelemetry.io/otel/exporters/stdout/stdoutlog v0.3.0
	go.opentelemetry.io/otel/exporters/stdout/stdoutmetric v1.27.0
	go.opentelemetry.io/otel/exporters/stdout/stdouttrace v1.27.0
	go.opentelemetry.io/otel/log v0.3.0
	go.opentelemetry.io/otel/metric v1.27.0
	go.opentelemetry.io/otel/sdk v1.27.0
	go.opentelemetry.io/otel/sdk/log v0.3.0
	go.opentelemetry.io/otel/sdk/metric v1.27.0
)

require (
	github.com/felixge/httpsnoop v1.0.4 // indirect
	github.com/go-logr/logr v1.4.1 // indirect
	github.com/go-logr/stdr v1.2.2 // indirect
	go.opentelemetry.io/otel/trace v1.27.0 // indirect
	golang.org/x/sys v0.20.0 // indirect
)
