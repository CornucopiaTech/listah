import axios from 'axios';

import { ZItems } from '@/lib/model/Items';
import type { IItem, } from '@/lib/model/Items';



export async function postItem(item: IItem) {
  console.info("In postItem - item", item);
  const url = `/api/${process.env.SERVER_STATE.ITEMS_UPDATE}`;
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


export async function getItem(opts: ZItemsSearch): Promise<IItems | void> {
  const url = `/api/${process.env.SERVER_STATE.ITEMS_READ}`;
  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify(opts),
    headers: { "Content-Type": "application/json", "Accept": "*/*" },
  });
  const res = await fetch(req);
  if (!res.ok) {
    console.error("Error in getItem: ", res.statusText);
    console.info(res);
    throw new Error('Network response was not ok');
  }

  const data = await res.json();
  return data;
}


export async function getTag(userId: string): Promise<IItems | void> {
  const url = `/api/${process.env.SERVER_STATE.TAG_READ}`;
  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify({ userId }),
    headers: { "Content-Type": "application/json", "Accept": "*/*" },
  });
  const res = await fetch(req);
  if (!res.ok) {
    console.error("Error in getTag: ", res.statusText);
    throw new Error('Network response was not ok');
  }
  return await res.json();
}


export async function getCategory(userId: string): Promise<ZItems | void> {
  const url = `/api/${process.env.SERVER_STATE.CATEGORY_READ}`;
  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify({ userId: userId }),
    headers: { "Content-Type": "application/json", "Accept": "*/*" },
  });
  const res = await fetch(req);
  if (!res.ok) {
    console.error("Error in getCategory: ", res.statusText);
    throw new Error('Network response was not ok');
  }
  return await res.json();
}
