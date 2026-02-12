

import type { IItem, IItemResponse, IItemsSearch } from '@/lib/model/Items';
import type { ICategoryResponse } from "@/lib/model/categories";
import type { ITagResponse } from "@/lib/model/tags";
import { API_ENDPOINTS } from '@/lib/helper/defaults';


export async function postItem(item: IItem) {
  const url = `${window.runtimeConfig.apiUrl}/${API_ENDPOINTS.updateItem}`;
  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify({ items: [item] }),
    headers: { "Content-Type": "application/json", "Accept": "*/*", },
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return await res.json();
}


export async function getItem(opts: IItemsSearch): Promise<IItemResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${API_ENDPOINTS.readItem}`;
  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify(opts),
    headers: { "Content-Type": "application/json", "Accept": "*/*" },
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await res.json();
  return data;
}


export async function getTag(userId: string): Promise<ITagResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${API_ENDPOINTS.readTag}`;
  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify({ userId }),
    headers: { "Content-Type": "application/json", "Accept": "*/*" },
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return await res.json();
}


export async function getCategory(userId: string): Promise<ICategoryResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${API_ENDPOINTS.readCategory}`;
  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify({ userId: userId }),
    headers: { "Content-Type": "application/json", "Accept": "*/*" },
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return await res.json();
}
