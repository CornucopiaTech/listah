import { TraceBaggage, ItemProto, ItemsProto, ItemsState } from '@/lib/model/ItemsModel';
import {
  propagation,
  context,
  trace,
  Span,
} from '@opentelemetry/api';
import { type Context } from '@opentelemetry/api';




export function getValidItem(passed: ItemProto, item: ItemState): ItemProto{
  const validItem: ItemProto= {
    id: passed.id,
    userId: passed.userId,
    summary: item.summary ? item.summary : passed.summary,
    category: item.category ? item.category : passed.category,
    description: item.description ? item.description : passed.description,
    note: item.note ? item.note : passed.note,
    tag: item.tag ? item.tag : passed.tag,
    softDelete: item.softDelete ? item.softDelete : passed.softDelete,
    properties: item.properties ? item.properties : passed.properties,
    reactivateAt: item.reactivateAt ? item.reactivateAt : passed.reactivateAt,
  };
  return validItem;
}

export async function postItem(item: ItemProto) {
  console.info("In postItem");
  console.info(item);
  const req = new Request("/api/postItem", {
    method: "POST",
    body: JSON.stringify({ items: [item] }),
    headers: { "Content-Type": "application/json", "Accept": "*/*", },
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}


export async function directGetItems(userId: string[], category: string[], tag: string[], pageNumber: number, recordsPerPage: number): Promise<ItemsProto | void> {

  const output: TraceBaggage = {};
  propagation.inject(context.active(), output);
  const { traceparent, b3 } = output;

  const url = (process.env.LISTAH_API_ITEMS_READ ?
    process.env.LISTAH_API_ITEMS_READ :
    process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ);

  console.info("In getItems - traceparent", traceparent, " - url", url);

  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify({
      userId, category, tag,
      pagination: { pageNumber, recordsPerPage }
    }),
     headers: { "Content-Type": "application/json", "Accept": "*/*", traceparent },
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}

export async function originalGetItems(userId: string, category: string[], tag: string[], pageNumber: number, recordsPerPage: number): Promise<ItemsProto | void> {
  const req = new Request('/api/getItems', {
    method: "POST",
    body: JSON.stringify({
      userId, category, tag,
      pagination: { pageNumber, recordsPerPage }
    })
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}


export async function getItems(userId: string[], category: string[], tag: string[], pageNumber: number, recordsPerPage: number): Promise<ItemsProto | void> {
  const req = new Request('/api/getItems', {
    method: "POST",
    body: JSON.stringify({
      category, tag,
      userId: [userId,],
      pagination: { pageNumber, recordsPerPage }
    })
  });
  const res = await fetch(req);
  if (!res.ok) {
    console.error("Error in getItems: ", res.statusText);
    throw new Error('Network response was not ok');
  }
  return res.json();
}
