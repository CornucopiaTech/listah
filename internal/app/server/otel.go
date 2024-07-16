package server

import (
	"context"
	"errors"
	"fmt"
	"log"

	gerrors "github.com/pkg/errors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploghttp"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetrichttp"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/exporters/stdout/stdoutlog"
	"go.opentelemetry.io/otel/log/global"
	"go.opentelemetry.io/otel/propagation"
	sdklog "go.opentelemetry.io/otel/sdk/log"
	"go.opentelemetry.io/otel/sdk/metric"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
)

// ToDo: Pass service name in config or env variable.
var serviceName = semconv.ServiceNameKey.String("Listah")

func initSDK() (shutdown func(context.Context) error, err error) {
	var shutdownFuncs []func(context.Context) error

	// shutdown calls cleanup functions registered via shutdownFuncs.
	// The errors from the calls are joined.
	// Each registered cleanup will be invoked once.
	shutdown = func(ctx context.Context) error {
		var err error
		for _, fn := range shutdownFuncs {
			err = errors.Join(err, fn(ctx))
		}
		shutdownFuncs = nil
		return err
	}

	//
	// handleErr calls shutdown for cleanup and makes sure that all errors are returned.
	handleErr := func(inErr error, errMsg string) {
		log.Fatalf(errMsg+": %v", err)
		fmt.Println(gerrors.Cause(err))
		err = errors.Join(inErr, shutdown(context.Background()))
	}

	//
	// Ensure default SDK resources and the required service name are set.
	// ToDo: Find out the purpose of this resource
	// ToDo: Read service name from config
	res, err := resource.Merge(
		resource.Default(),
		resource.NewWithAttributes(
			semconv.SchemaURL,
			serviceName,
			// semconv.ServiceName(serviceName),
		),
	)
	if err != nil {
		handleErr(err, "Failed to create a resource for Otel")
		log.Fatalf("Failed to create a resource for Otel: %v", err)
	}

	//
	// Set up propagator.
	prop := initPropagator()
	otel.SetTextMapPropagator(prop)

	//
	// Create a new tracer provider with a batch span processor and the given exporter.
	tracerProviderHttp, err := initHttpTracerProvider(context.Background(), res)
	if err != nil {
		handleErr(err, "Failed to initialize HTTP tracer for Otel")
		log.Fatalf("Failed to initialize HTTP tracer for Otel: %v", err)
	}
	shutdownFuncs = append(shutdownFuncs, tracerProviderHttp.Shutdown)
	otel.SetTracerProvider(tracerProviderHttp)

	// //
	// // Set up HTTP meter provider
	// meterProviderHttp, err := initHttpMeterProvider(ctx, res)
	// if err != nil {
	// 	handleErr(err, "Failed to create a meter provider for Otel")
	// 	log.Fatalf("Failed to create a meter provider for Otel: %v", err)
	// }
	// shutdownFuncs = append(shutdownFuncs, meterProviderHttp.Shutdown)
	// otel.SetMeterProvider(meterProviderHttp)

	// //
	// // Set up gRPC meter provider
	// meterProviderGrpc, err := initGrpcMeterProvider(ctx, res, conn)
	// if err != nil {
	// 	handleErr(err, "Failed to create a meter provider for Otel")
	// 	log.Fatalf("Failed to create a meter provider for Otel: %v", err)
	// }
	// shutdownFuncs = append(shutdownFuncs, meterProviderGrpc.Shutdown)
	// otel.SetMeterProvider(meterProviderGrpc)

	//
	// Set up Console logger provider.
	loggerProviderConsole, err := initConsoleLoggerProvider()
	if err != nil {
		handleErr(err, "Failed to create a Console log provider for Otel")
		log.Fatalf("Failed to create a console log provider for Otel: %v", err)
	}
	shutdownFuncs = append(shutdownFuncs, loggerProviderConsole.Shutdown)
	global.SetLoggerProvider(loggerProviderConsole)

	return
}

// Initialize a gRPC connection to be used by both the tracer and meter
// providers.
func initConn() (*grpc.ClientConn, error) {
	// It connects the OpenTelemetry Collector through local gRPC connection.
	// You may replace `localhost:4317` with your endpoint.
	// ToDo: Read gRPC endpoint from config or env variable.
	conn, err := grpc.NewClient("http://localhost:4317",
		// Note the use of insecure transport here. TLS is recommended in production.
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create gRPC connection to collector: %w", err)
	}

	return conn, err
}

func initPropagator() propagation.TextMapPropagator {
	return propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	)
}

// Initializes an OTLP exporter, and configures the corresponding trace provider.
func initHttpTracerProvider(ctx context.Context, res *resource.Resource) (*sdktrace.TracerProvider, error) {
	// Define Http exporter
	client := otlptracehttp.NewClient()
	// exporter, err := otlptracehttp.New(ctx, client)
	// client := otlptracehttp.NewClient()
	exporter, err := otlptrace.New(ctx, client)
	// exporter, err := otlptracehttp.New(ctx, client)
	if err != nil {
		return nil, fmt.Errorf("failed to create HTTP trace exporter: %w", err)
	}

	return sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(res),
	), nil
}

// Initializes an OTLP exporter, and configures the corresponding meter provider.
func initHttpMeterProvider(ctx context.Context, res *resource.Resource) (*sdkmetric.MeterProvider, error) {
	metricExporter, err := otlpmetrichttp.New(ctx)
	if err != nil {
		return nil, fmt.Errorf("Failed to create HTTP metrics exporter: %w", err)
	}

	meterProvider := sdkmetric.NewMeterProvider(
		sdkmetric.WithReader(sdkmetric.NewPeriodicReader(metricExporter)),
		sdkmetric.WithResource(res),
	)

	return meterProvider, nil
}

// Initializes an OTLP exporter, and configures the corresponding meter provider.
func initGrpcMeterProvider(ctx context.Context, res *resource.Resource, conn *grpc.ClientConn) (*sdkmetric.MeterProvider, error) {
	metricExporter, err := otlpmetricgrpc.New(ctx, otlpmetricgrpc.WithGRPCConn(conn))
	if err != nil {
		return nil, fmt.Errorf("Failed to create gRPC metrics exporter: %w", err)
	}

	meterProvider := sdkmetric.NewMeterProvider(
		sdkmetric.WithReader(sdkmetric.NewPeriodicReader(metricExporter)),
		sdkmetric.WithResource(res),
	)

	return meterProvider, nil
}

func initHttpLoggerProvider(ctx context.Context) (*sdklog.LoggerProvider, error) {
	logExporter, err := otlploghttp.New(ctx)
	if err != nil {
		return nil, err
	}

	loggerProvider := sdklog.NewLoggerProvider(
		sdklog.WithProcessor(sdklog.NewBatchProcessor(logExporter)),
	)
	return loggerProvider, nil
}

func initConsoleLoggerProvider() (*sdklog.LoggerProvider, error) {
	logExporter, err := stdoutlog.New()
	if err != nil {
		return nil, err
	}

	loggerProvider := sdklog.NewLoggerProvider(
		sdklog.WithProcessor(sdklog.NewBatchProcessor(logExporter)),
	)
	return loggerProvider, nil
}

func SetupOtel() {
	// Exporting to different platforms can be configured here
	otel.SetTracerProvider(trace.NewTracerProvider())
	otel.SetMeterProvider(metric.NewMeterProvider())
	otel.SetTextMapPropagator(propagation.TraceContext{})
}
