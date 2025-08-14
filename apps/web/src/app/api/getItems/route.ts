import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { headers } from 'next/headers';

import {
  propagation,
  context,
  trace,
  Span,
} from '@opentelemetry/api';
import { type Context } from '@opentelemetry/api';
import { TraceBaggage, ItemProto } from '@/lib/model/ItemsModel';

export async function POST(request: NextRequest) {
  const output: TraceBaggage = {};
  propagation.inject(context.active(), output);
  const { traceparent, b3 } = output;
  const initReq = await request.json();
  const url = (process.env.LISTAH_API_ITEMS_READ ?
    process.env.LISTAH_API_ITEMS_READ :
    process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ);

  console.info("/api/postItem - output and url", url);
  console.info(output);
  console.info(url);
  console.info(initReq);

  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify(initReq),
    headers: { "Content-Type": "application/json", "Accept": "*/*", traceparent },
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json()
  return Response.json(data)
}
