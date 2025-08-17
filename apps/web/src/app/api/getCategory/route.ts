import type { NextRequest } from 'next/server';
import {
  propagation,
  context,
} from '@opentelemetry/api';
import { TraceBaggage} from '@/lib/model/ItemsModel';

export async function POST(request: NextRequest): Promise<Response | void> {
  const output: TraceBaggage = {};
  propagation.inject(context.active(), output);
  const { traceparent } = output;
  const initReq = await request.json();
  const url = (process.env.LISTAH_API_CATEGORY_READ ?
    process.env.LISTAH_API_CATEGORY_READ :
    process.env.NEXT_PUBLIC_LISTAH_API_CATEGORY_READ);

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
