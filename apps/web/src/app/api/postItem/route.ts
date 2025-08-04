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
import type { ITraceBaggage } from '@/app/items/ItemsModel';

export async function POST(request: NextRequest) {
  const output: ITraceBaggage = {};
  propagation.inject(context.active(), output);

  console.info("/api/postItem - output");
  console.info(output);

  const activeSpan = trace.getActiveSpan();
  console.info("/api/postItem - activeSpan");
  console.info(activeSpan?.spanContext());

  const { traceparent, b3 } = output;
  const initReq = await request.json();
  console.info("In /api/postItem")
  console.info(initReq)
  // const { pageNumber, recordsPerPage, userId, category, tags } = initReq

  const input: ITraceBaggage = { traceparent }
  propagation.extract(context.active(), input);
  const url = (process.env.LISTAH_API_ITEMS_UPDATE ?
    process.env.LISTAH_API_ITEMS_UPDATE :
    process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_UPDATE);

  console.info(`URL: ${url}`)

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
