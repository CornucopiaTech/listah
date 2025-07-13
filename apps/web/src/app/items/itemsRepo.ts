
import type { IProtoItems, IProtoItem } from '@/app/items/ItemsModel';
import {
  type Context,
  propagation,
  trace,
  Span,
  context,
} from '@opentelemetry/api';
import '@/envConfig.ts';




export function fetchItems(qKey: any){
  const { queryKey } = qKey;
  const { url, traceparent, userId, category, tags} = queryKey[1];
  console.info(`Function Parameters -- url: ${url} tp: ${traceparent} u: ${userId}\t c: ${category}\t t:${tags}`);

  const reqBody = {
    items: [ {userId, category, tags}],
    "traceparent": traceparent,
    // "tracestate": tracestate
  }



  const theRequest = new Request(url, {
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
      traceparent: traceparent,
    },
  });


  fetch(theRequest).then((res) => {
    console.info(`REPO: fetchItems: res: `);
    console.info(res);
    if (!res.ok) {
      console.error(`REPO: fetchItems: HTTP error! status: ${res.status}`);
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  }).then((data) => {
    console.info(`REPO: fetchItems: data: `);
    console.info(data);
    if (data.items === undefined || data.items === null) {
      console.error(`REPO: fetchItems: Unknown response from API: ${JSON.stringify(data)}`);
      throw new Error(`Unknown response from API: ${JSON.stringify(data)}`);
    }
    return data;
  }).catch((e) => {
    console.error(`Error thrown: ${e}`);
    throw new Error(`Error thrown: ${e}`);
  })
}


export async function fetchItemsAsync(qKey: any){
  const { queryKey } = qKey;
  const { url, traceparent, userId, category, tags} = queryKey[1];
  console.info(`Function Parameters -- url: ${url} tp: ${traceparent} u: ${userId}\t c: ${category}\t t:${tags}`);


  const reqBody = {
    items: [ {userId, category, tags}],
    "traceparent": traceparent,
    // "tracestate": tracestate
  }



  const theRequest = new Request(url, {
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
      traceparent,
    },
  });


  try{
    const res = await fetch(theRequest);
    console.info(`REPO - fetchItems - res:`);
    console.info(res);

    const data = await res.json();
    console.info(`REPO - fetchItems - data:`);
    console.info(data);

    // if (data.items === undefined || data.items === null) {
    //   throw new Error(`Unknown response from API: ${JSON.stringify(data)}`);
    // }

    return data;
  } catch (e) {
    console.error(`Error thrown: ${e}`);
    throw new Error(`Error thrown: ${e}`);
  }
}


export async function getAllItems(
  {
    parentTraceId, userId, category, tags
  }:{
      parentTraceId: string,
      userId: string,
      category: string | string [],
      tags: string | string []
  }
): Promise<IProtoItems> {
  let url = process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ ? process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ : "";
  // console.log(`A2. Request url: ${url}`)

  let reqUrl = url == "" ? "http://localhost:8080/listah.v1.ItemService/Read" : url

  const reqBody = {
    items: [ {userId, category, tags}],
    "traceparent": parentTraceId,
    // "tracestate": tracestate
  }

  const theRequest = new Request(reqUrl, {
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
      "traceparent": parentTraceId,
    },
  });

  try{
    const res = await fetch(theRequest);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    if (data.items === undefined || data.items === null || data.items.length === 0) {
      throw new Error(`Unknown response from API: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (e) {
    console.error(`Unable to retrieve API data. Error thrown: ${e}`);
    throw e;
  }
}
