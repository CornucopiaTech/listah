package telemetry

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"cornucopia/listah/internal/app/bootstrap"

	gerrors "github.com/pkg/errors"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetrichttp"
	"go.opentelemetry.io/otel/exporters/stdout/stdoutlog"
	"go.opentelemetry.io/otel/exporters/stdout/stdoutmetric"
	"go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
	"go.opentelemetry.io/otel/log/global"
	"go.opentelemetry.io/otel/propagation"

	sdklog "go.opentelemetry.io/otel/sdk/log"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"

	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"

	// "go.opentelemetry.io/otel/trace"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	// "go.opentelemetry.io/contrib/propagators/b3"
	redisotel "github.com/redis/go-redis/extra/redisotel-native/v9"
)

// setupOTelSDK bootstraps the OpenTelemetry pipeline.
// If it does not return an error, make sure to call shutdown for proper cleanup.
func SetupOTelSDK(ctx context.Context, i *bootstrap.Infra) (shutdown func(context.Context) error, noContextShutdown func() error, err error) {
	var shutdownFuncs []func(context.Context) error
	var noContextShutdownFuncs []func() error

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
	noContextShutdown = func() error {
		var err error
		for _, fn := range noContextShutdownFuncs {
			err = errors.Join(err, fn())
		}
		noContextShutdownFuncs = nil
		return err
	}

	// handleErr calls shutdown for cleanup and makes sure that all errors are returned.
	handleErr := func(inErr error, errMsg string) {
		log.Fatalf(errMsg+": %v", err)
		fmt.Println(gerrors.Cause(err))
		err = errors.Join(inErr, shutdown(ctx))
	}
	// Create resource.
	// The resource is used to identify the source of telemetry.
	res := resource.NewWithAttributes(
		semconv.SchemaURL,
		semconv.ServiceNameKey.String(i.Config.AppName),
	)

	// Set up propagator.
	prop := newPropagator()
	otel.SetTextMapPropagator(prop)

	// Set up trace provider.
	tracerProvider, err := newTracerProvider(i, res)
	if err != nil {
		handleErr(err, "Failed to create a trace provider for Otel")
		return
	}
	shutdownFuncs = append(shutdownFuncs, tracerProvider.Shutdown)
	otel.SetTracerProvider(tracerProvider)

	// Set up meter provider.
	meterProvider, err := newMeterProvider(i, res)
	if err != nil {
		handleErr(err, "Failed to create a meter provider for Otel")
		return
	}
	shutdownFuncs = append(shutdownFuncs, meterProvider.Shutdown)
	otel.SetMeterProvider(meterProvider)

	// Set up logger provider.
	loggerProvider, err := newLoggerProvider()
	if err != nil {
		handleErr(err, "Failed to create a log provider for Otel")
		return
	}
	shutdownFuncs = append(shutdownFuncs, loggerProvider.Shutdown)
	global.SetLoggerProvider(loggerProvider)

	// Set up redis Instrumantation
	rOtel, err := setupRedisOtel()
	if err != nil {
		handleErr(err, "Failed to instrument redis db")
		return
	}
	noContextShutdownFuncs = append(noContextShutdownFuncs, rOtel.Shutdown)

	return
}

func newPropagator() propagation.TextMapPropagator {
	return propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	)
}

func newTracerProvider(i *bootstrap.Infra, r *resource.Resource) (*sdktrace.TracerProvider, error) {
	// Create exporter
	e, err := createOtelTraceExporter(i)
	if err != nil {
		return nil, fmt.Errorf("failed to create HTTP trace exporter: %w", err)
	}

	tracerProvider := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(e,
			sdktrace.WithBatchTimeout(
				time.Duration(i.Config.Instrumentation.TraceFreqSec)*time.Second,
			),
		),
		sdktrace.WithResource(r),
	)
	return tracerProvider, nil
}

func newMeterProvider(i *bootstrap.Infra, r *resource.Resource) (*sdkmetric.MeterProvider, error) {
	// Create exporter
	e, err := createOtelMetricExporter(i)
	if err != nil {
		return nil, fmt.Errorf("failed to create HTTP metrics exporter: %w", err)
	}

	meterProvider := sdkmetric.NewMeterProvider(
		sdkmetric.WithReader(sdkmetric.NewPeriodicReader(e,
			sdkmetric.WithInterval(time.Duration(i.Config.Instrumentation.MetricFreqSec)*time.Second))),
		sdkmetric.WithResource(r),
	)

	return meterProvider, nil
}

func newLoggerProvider() (*sdklog.LoggerProvider, error) {
	logExporter, err := stdoutlog.New()
	if err != nil {
		return nil, err
	}

	loggerProvider := sdklog.NewLoggerProvider(
		sdklog.WithProcessor(sdklog.NewBatchProcessor(logExporter)),
	)
	return loggerProvider, nil
}

func createOtelTraceExporter(i *bootstrap.Infra) (sdktrace.SpanExporter, error) {
	var exporter sdktrace.SpanExporter
	var err error
	switch i.Config.Instrumentation.OltpExporterType {
	case "jaeger":
		return nil, errors.New("jaeger exporter is no longer supported, please use otlp")
	case "otlp":
		opts := []otlptracehttp.Option{
			otlptracehttp.WithEndpointURL(i.Config.Instrumentation.OtelExporterEndpoint),
		}
		if !withSecure() {
			opts = append(opts, otlptracehttp.WithInsecure())
		}
		exporter, err = otlptrace.New(
			context.Background(),
			otlptracehttp.NewClient(opts...),
		)
	case "stdout":
		exporter, err = stdouttrace.New()
	default:
		return nil, fmt.Errorf("unrecognized exporter type %s", i.Config.Instrumentation.OltpExporterType)
	}
	return exporter, err
}

func createOtelMetricExporter(i *bootstrap.Infra) (sdkmetric.Exporter, error) {
	var exporter sdkmetric.Exporter
	var err error
	switch i.Config.Instrumentation.OltpExporterType {
	case "jaeger":
		return nil, errors.New("jaeger exporter is no longer supported, please use otlp")
	case "otlp":
		opts := []otlpmetrichttp.Option{
			otlpmetrichttp.WithEndpointURL(i.Config.Instrumentation.OtelExporterEndpoint),
		}
		if !withSecure() {
			opts = append(opts, otlpmetrichttp.WithInsecure())
		}
		exporter, err = otlpmetrichttp.New(context.Background(), opts...)
	case "stdout":
		exporter, err = stdoutmetric.New()
	default:
		return nil, fmt.Errorf("unrecognized exporter type %s", i.Config.Instrumentation.OltpExporterType)
	}
	return exporter, err
}

func setupRedisOtel() (*redisotel.ObservabilityInstance, error) {
	otelInstance := redisotel.GetObservabilityInstance()
	config := redisotel.NewConfig().
		// You must enable OTel explicitly
		WithEnabled(true).
		// Enable the metric groups you want to collect. Use bitwise OR
		// to combine multiple groups. The default is `MetricGroupAll`
		// which includes all groups.
		WithMetricGroups(redisotel.MetricGroupFlagCommand |
			redisotel.MetricGroupFlagConnectionBasic |
			redisotel.MetricGroupFlagResiliency |
			redisotel.MetricGroupFlagConnectionAdvanced).
		// Filter which commands to track
		WithIncludeCommands([]string{"GET", "SET"}).
		WithExcludeCommands([]string{"DEBUG", "SLOWLOG"}).
		// Privacy controls
		WithHidePubSubChannelNames(true).
		WithHideStreamNames(true).
		// Custom histogram buckets
		WithHistogramBuckets([]float64{
			0.0001, // 0.1ms
			0.0005, // 0.5ms
			0.001,  // 1ms
			0.005,  // 5ms
			0.01,   // 10ms
			0.05,   // 50ms
			0.1,    // 100ms
			0.5,    // 500ms
			1.0,    // 1s
			5.0,    // 5s
			10.0,   // 10s
		})

	if err := otelInstance.Init(config); err != nil {
		return nil, err
	}
	return otelInstance, nil
}

func withSecure() bool {
	return strings.HasPrefix(
		os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT"), "https://") ||
		strings.ToLower(os.Getenv("OTEL_EXPORTER_OTLP_INSECURE")) == "false"
}
