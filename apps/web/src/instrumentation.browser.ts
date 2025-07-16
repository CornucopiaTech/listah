import {
  defaultResource,
  resourceFromAttributes,
} from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import XMLHttpRequestInstrumentation from '@opentelemetry/instrumentation-xml-http-request';
import FetchInstrumentation from '@opentelemetry/instrumentation-fetch';
import { v7 as uuidv7 } from 'uuid';


export function startInstrumentation() {
  const provider = new WebTracerProvider({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: process.env.APP_NAME,
      [ATTR_SERVICE_VERSION]: process.env.APP_VERSION || '1.0.0',
    }),
    spanProcessors: [
      new SimpleSpanProcessor(new ConsoleSpanExporter()),
    ]
  });

  provider.register({
    contextManager: new ZoneContextManager(),
  });
}
startInstrumentation();
