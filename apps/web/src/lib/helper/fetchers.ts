

import type {
  IItemRequest,
  IItem,
  IItemResponse,
} from '@/lib/model/item';
import type {
  ICategoryRequest,
  ICategoryResponse
} from '@/lib/model/category';
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

export async function getItem(opts: IItemRequest): Promise<IItemResponse> {
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

export async function getCategory(opts: ICategoryRequest): Promise<ICategoryResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${API_ENDPOINTS.readCategory}`;
  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify(opts),
    headers: { "Content-Type": "application/json", "Accept": "*/*" },
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return await res.json();
}
