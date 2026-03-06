

import type {
  IItemReadRequest,
  IItem,
  IItemReadResponse,
} from '@/lib/model/item';
import type {
  ITagCategoryReadRequest,
  ITagCategoryReadResponse
} from '@/lib/model/tag';
import type {
  ISavedFilter,
  ISavedFilterCategoryReadRequest,
  ISavedFilterCategoryReadResponse
} from '@/lib/model/savedFilter';

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

export async function postSavedFilter(f: ISavedFilter) {
  const url = `${window.runtimeConfig.apiUrl}/${API_ENDPOINTS.updateSavedFilter}`;
  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify({ savedFilters: [f] }),
    headers: { "Content-Type": "application/json", "Accept": "*/*", },
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return await res.json();
}

export async function getItem(opts: IItemReadRequest): Promise<IItemReadResponse> {
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


export async function getTag(opts: ITagCategoryReadRequest): Promise<ITagCategoryReadResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${API_ENDPOINTS.readTag}`;
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

export async function getSavedFilter(opts: ISavedFilterCategoryReadRequest): Promise<ISavedFilterCategoryReadResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${API_ENDPOINTS.readSavedFilter}`;
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
