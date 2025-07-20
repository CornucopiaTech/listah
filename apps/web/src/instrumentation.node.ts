/*instrumentation.ts*/
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-node';
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

let tUrl = process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ? process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT : process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT;
tUrl = tUrl ? tUrl : 'http://localhost:4318/v1/traces';


let mUrl = process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT ? process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT : process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_METRICS_ENDPOINT;
mUrl = mUrl ? mUrl : 'http://localhost:4318/v1/metrics';


const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: process.env.NEXT_PUBLIC_WEBAPP_NAME,
    [ATTR_SERVICE_VERSION]: process.env.APP_VERSION || '1.0.0',
  }),
   spanProcessors: [
    // new SimpleSpanProcessor(new ConsoleSpanExporter()),
    new SimpleSpanProcessor(new OTLPTraceExporter({ url: tUrl })),
  ],
  traceExporter: new OTLPTraceExporter({ url: tUrl }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
});

registerInstrumentations({
  instrumentations: [new HttpInstrumentation(), new UndiciInstrumentation()],
});

sdk.start();
