import type { TraceBaggage, ItemProto, ItemsProto} from '@/lib/model/ItemsModel';
import {
  propagation,
  context,
} from '@opentelemetry/api';
import {
  queryOptions,
} from '@tanstack/react-query';


export function getItemsGroupOptions(userId: string, category: string [], tag: string[], pageNumber: number, recordsPerPage: number) {
  return queryOptions({
     queryKey: ["getItems", userId, category, tag, pageNumber, recordsPerPage],
     queryFn: () => getItems(userId, category, tag, pageNumber, recordsPerPage),
     staleTime: 24 * 60 * 60 * 1000,
   })
}



export function getTagGroupOptions(userId: string) {
  return queryOptions({
     queryKey: ["getTag", userId],
     queryFn: () => getTag(userId),
     staleTime: 24 * 60 * 60 * 1000,
  })
}

export function getCategoryGroupOptions(userId: string) {
  return queryOptions({
     queryKey: ["getCategory", userId],
     queryFn: () => getCategory(userId),
     staleTime: 24 * 60 * 60 * 1000,
  })
}

export function getValidItem(storeItem: ItemProto, apiItem: ItemProto): ItemProto{
  if (!storeItem){
    return apiItem;
  }
  const validItem: ItemProto = {
    id: storeItem.id ? storeItem.id : apiItem.id,
    userId: storeItem.userId ? storeItem.userId : apiItem.userId,
    summary: storeItem.summary ? storeItem.summary : apiItem.summary,
    category: storeItem.category ? storeItem.category : apiItem.category,
    description: storeItem.description ? storeItem.description : apiItem.description,
    note: storeItem.note ? storeItem.note : apiItem.note,
    tag: storeItem.tag ? storeItem.tag : apiItem.tag,
    softDelete: storeItem.softDelete ? storeItem.softDelete : apiItem.softDelete,
    properties: storeItem.properties ? storeItem.properties : apiItem.properties,
    reactivateAt: storeItem.reactivateAt ? storeItem.reactivateAt : apiItem.reactivateAt,
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

export async function getItems(userId: string, category: string[], tag: string[], pageNumber: number, recordsPerPage: number): Promise<ItemsProto | void> {

  // Get traceparent from context
  const output: TraceBaggage = {};
  propagation.inject(context.active(), output);
  let { traceparent }: {
    traceparent: string | undefined,
  } = output;
  traceparent = traceparent ? traceparent : "";

  // Define url for API call
  let url: string = process.env.LISTAH_PROXY_ITEMS_READ ? process.env.LISTAH_PROXY_ITEMS_READ : "";
  url = "/api/" + url;

  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify({
      category, tag,
      userId: [userId,],
      pagination: { pageNumber, recordsPerPage }
    }),
    headers: { "Content-Type": "application/json", "Accept": "*/*", "traceparent": traceparent ? traceparent : ""},
  });
  const res = await fetch(req);
  if (!res.ok) {
    console.error("Error in getItems - ", res.statusText);
    console.info(res);
    throw new Error('Error in getItems - ' + res.statusText);
  }

  const data = await res.json();
  return data;
}


export async function getItem(userId: string, itemId: string): Promise<ItemsProto | void> {
  // Get traceparent from context
  const output: TraceBaggage = {};
  propagation.inject(context.active(), output);
  let { traceparent } = output;
  traceparent = traceparent ? traceparent : "";

  // Define url for API call
  let url: string = process.env.LISTAH_PROXY_ITEMS_READ ? process.env.LISTAH_PROXY_ITEMS_READ : "";
  url = "/api/" + url;


  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify({
      userId: [ userId ],
      id: [ itemId ],
    }),
    headers: { "Content-Type": "application/json", "Accept": "*/*", "traceparent": traceparent ? traceparent : "" },
  });
  const res = await fetch(req);
  if (!res.ok) {
    console.error("Error in getItems - ", res.statusText);
    console.info(res);
    throw new Error('Error in getItems - ' + res.statusText);
  }
  const data = await res.json();
  return data;
}


export async function getTag(userId: string): Promise<ItemsProto | void> {
  // Get traceparent from context
  const output: TraceBaggage = {};
  propagation.inject(context.active(), output);
  let { traceparent } = output;
  traceparent = traceparent ? traceparent : "";

  // Define url for API call
  let url: string = process.env.LISTAH_PROXY_TAG_READ ? process.env.LISTAH_PROXY_TAG_READ : "";
  url = "/api/" + url;

  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify({ userId: [ userId ] }),
    headers: { "Content-Type": "application/json", "Accept": "*/*", "traceparent": traceparent ? traceparent : "" },
  });
  const res = await fetch(req);
  if (!res.ok) {
    console.error("Error in getTag - ", res.statusText);
    console.info(res);
    throw new Error('Error in getTag - ' + res.statusText);
  }
  const data = await res.json();
  return data;
}


export async function getCategory(userId: string): Promise<ItemsProto | void> {
  // Get traceparent from context
  const output: TraceBaggage = {};
  propagation.inject(context.active(), output);
  let { traceparent } = output;
  traceparent = traceparent ? traceparent : "";

  // Define url for API call
  let url: string = process.env.LISTAH_PROXY_CATEGORY_READ ? process.env.LISTAH_PROXY_CATEGORY_READ : "";
  url = "/api/" + url;

  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify({ userId: [userId] }),
    headers: { "Content-Type": "application/json", "Accept": "*/*", "traceparent": traceparent ? traceparent : "" },
  });
  const res = await fetch(req);
  if (!res.ok) {
    console.error("Error in getCategory - ", res.statusText);
    console.info(res);
    throw new Error('Error in getCategory - ' + res.statusText);
  }
  const data = await res.json();
  return data;
}
