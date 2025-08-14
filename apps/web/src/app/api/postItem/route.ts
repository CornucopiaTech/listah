import type { NextRequest } from 'next/server';
import {
  propagation,
  context,
  trace,
} from '@opentelemetry/api';
import { TraceBaggage, ItemProto } from '@/lib/model/ItemsModel';

export async function POST(request: NextRequest) {
  const output: TraceBaggage = {};
  propagation.inject(context.active(), output);
  const activeSpan = trace.getActiveSpan();

  const { traceparent, b3 } = output;
  const initReq = await request.json();


  const input: TraceBaggage = { traceparent }
  propagation.extract(context.active(), input);
  const url = (process.env.LISTAH_API_ITEMS_UPDATE ?
    process.env.LISTAH_API_ITEMS_UPDATE :
    process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_UPDATE);


  console.info("/api/postItem - output");
  console.info(output);
  console.info("/api/postItem - activeSpan");
  console.info(activeSpan?.spanContext());
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
