import type { TraceBaggage, ItemProto, ItemsProto} from '@/lib/model/ItemsModel';
import {
  propagation,
  context,
} from '@opentelemetry/api';
import {
  queryOptions,
} from '@tanstack/react-query';


export function getItemsGroupOptions(userId: string, categoryFilter: string[],
                tagFilter: string[], pageNumber: number, pageSize: number,
                searchQuery: string, fromDate: string, toDate: string,
                sortQuery: string) {
  return queryOptions({
    queryKey: [
      "getItems", userId, categoryFilter, tagFilter, pageNumber, pageSize,
      searchQuery, fromDate, toDate, sortQuery
    ],
    queryFn: () => getItems(
        userId, categoryFilter, tagFilter, pageNumber, pageSize,
        searchQuery, fromDate, toDate, sortQuery
      ),
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

export async function getItems(userId: string, categoryFilter: string[],
                              tagFilter: string[], pageNumber: number,
                              pageSize: number, searchQuery: string,
                              fromDate: string, toDate: string,
                              sortQuery: string): Promise<ItemsProto | void> {
  const url = `/api/${process.env.LISTAH_PROXY_ITEMS_READ}`;

  const reqBody = {
    userId, tagFilter, categoryFilter, searchQuery,
    fromDate, toDate, pageSize, pageNumber, sortQuery,
  };
  console.info("In getItems, reqBody: ", reqBody);


  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: { "Content-Type": "application/json", "Accept": "*/*" },
  });
  const res = await fetch(req);
  if (!res.ok) {
    console.error("Error in getItems: ", res.statusText);
    console.info(res);
    throw new Error('Network response was not ok');
  }

  const data = await res.json();
  // console.info("In getItems, url: ", url);
  // console.info("In getItems, res.status: ", res.status);
  // console.info("In getItems, data: ");
  // console.info(data.items ? data.items[0] : {});
  return data;
}


export async function getTag(userId: string): Promise<ItemsProto | void> {
  const req = new Request('/api/getTag', {
    method: "POST",
    body: JSON.stringify({ userId: [ userId ] })
  });
  const res = await fetch(req);
  if (!res.ok) {
    console.error("Error in getItems: ", res.statusText);
    throw new Error('Network response was not ok');
  }
  return res.json();
}


export async function getCategory(userId: string): Promise<ItemsProto | void> {
  const req = new Request('/api/getCategory', {
    method: "POST",
    body: JSON.stringify({ userId: [ userId ] })
  });
  const res = await fetch(req);
  if (!res.ok) {
    console.error("Error in getItems: ", res.statusText);
    throw new Error('Network response was not ok');
  }
  return res.json();
}
