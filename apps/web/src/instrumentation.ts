import { registerOTel } from '@vercel/otel';

import '@/envConfig.ts';


export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    registerOTel(process.env.NEXT_PUBLIC_APP_NAME);
  }
}
