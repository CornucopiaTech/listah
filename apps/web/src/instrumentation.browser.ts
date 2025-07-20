/* document-load.ts|js file - the code is the same for both the languages */
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import {
  resourceFromAttributes,
} from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import {
  CompositePropagator,
  W3CTraceContextPropagator,
  W3CBaggagePropagator,
} from '@opentelemetry/core';


let tUrl = process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ? process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT : process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT;
tUrl = tUrl ? tUrl : 'http://localhost:4318/v1/traces';


const provider = new WebTracerProvider({
  resource: resourceFromAttributes({
[ATTR_SERVICE_NAME]: process.env.NEXT_PUBLIC_WEBAPP_NAME,
    [ATTR_SERVICE_VERSION]: process.env.APP_VERSION || '1.0.0',
  }),
  spanProcessors: [
    new SimpleSpanProcessor(new ConsoleSpanExporter()),
    new SimpleSpanProcessor(new OTLPTraceExporter({ url: tUrl })),
  ],
});

provider.register({
  contextManager: new ZoneContextManager(),
  propagator: new CompositePropagator({
    propagators: [
      // new B3Propagator(),
      new W3CBaggagePropagator(),
      new W3CTraceContextPropagator(),
    ],
  }),
});

// Registering instrumentations
registerInstrumentations({
  instrumentations: [
    new XMLHttpRequestInstrumentation({
      // ignoreUrls: [/localhost/],
      propagateTraceHeaderCorsUrls: [
        'http://localhost:8080',
      ],
    }),
  ],
});
