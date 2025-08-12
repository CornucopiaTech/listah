import {
  trace, context, type Span, type Context
} from '@opentelemetry/api';

import '@/envConfig.ts';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./instrumentation.browser');
  }
}

const appName = process.env.NEXT_PUBLIC_WEBAPP_NAME ? process.env.NEXT_PUBLIC_WEBAPP_NAME : "listah-web";
const appVersion = process.env.APP_VERSION ? process.env.APP_VERSION : "1.0.0"
export const tracer = trace.getTracer(appName, appVersion);
