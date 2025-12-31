import type { ItemProto, ItemsProto } from '@/lib/model/ItemsModel';



export async function postItem(item: ItemProto) {
  console.info("In postItem - item", item);
  const url = `/api/${process.env.LISTAH_PROXY_ITEMS_UPDATE}`;
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


export async function getItem(opts: ItemsSearchSchema): Promise<ItemsProto | void> {
  const url = `/api/${process.env.LISTAH_PROXY_ITEMS_READ}`;
  console.info("In getItem, url, opts: ", url, opts, );

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

export async function getTag(userId: string): Promise<ItemsProto | void> {
  const url = `/api/${process.env.LISTAH_PROXY_TAG_READ}`;
  console.info("In getTag, userId: ", userId);

  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify({ userId: userId }),
    headers: { "Content-Type": "application/json", "Accept": "*/*" },
  });
  const res = await fetch(req);
  if (!res.ok) {
    console.error("Error in getTag: ", res.statusText);
    throw new Error('Network response was not ok');
  }
  return await res.json();
}

export async function getCategory(userId: string): Promise<ItemsProto | void> {
  const url = `/api/${process.env.LISTAH_PROXY_CATEGORY_READ}`;
  console.info("In getCategory, userId: ", userId);
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
