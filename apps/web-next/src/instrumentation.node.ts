import * as opentelemetry from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';


const traceEndpoint = process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT ? `${process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces` : 'http://localhost:4318/v1/traces'
const metricEndpoint = process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT ? `${process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics` : 'http://localhost:4318/v1/metrics'

const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: process.env.NEXT_PUBLIC_WEBAPP_NAME ? process.env.NEXT_PUBLIC_WEBAPP_NAME : 'listah-web-next',
  }),
  spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter({url: traceEndpoint,})),
  traceExporter: new OTLPTraceExporter({
    // optional - default url is http://localhost:4318/v1/traces
    url: traceEndpoint,
  }),
  // metricReader: new PeriodicExportingMetricReader({
  //   exporter: new OTLPMetricExporter({
  //     // optional - default is http://localhost:4318/v1/metrics
  //     url: metricEndpoint
  //   }),
  // }),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();



