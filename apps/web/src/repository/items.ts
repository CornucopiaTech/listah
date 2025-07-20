// import '@/envConfig.ts';
import type { IProtoItems, IProtoItem } from '@/app/items/ItemsModel';
import {
  type Context,
  propagation,
  trace,
  Span,
  context,
} from '@opentelemetry/api';

export function getItems(items: ItemModelInterface){

}

interface Carrier {
  traceparent?: string;
  tracestate?: string;
}



export async function fetchItems(qKey){
  let url = process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ ? process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ : "";
  // console.log(`A2. Request url: ${url}`)

  let reqUrl = url == "" ? "http://localhost:8080/listah.v1.ItemService/Read" : url
  // console.log(`A2. Request reqUrl: ${reqUrl}`)

  // Create an output object that conforms to that interface.
  const output: Carrier = {};

  propagation.inject(context.active(), output);
  console.info(`Repo 1. Output object: ${JSON.stringify(output)}`);


  // console.info(`Repo 1. Fetcher function Parameters: qKey`)
  // console.info(qKey)
  const { queryKey } = qKey;
  const { traceparent, userId, category, tags} = queryKey[1];
  console.info(`Repo 1. function Parameters: tp: ${JSON.stringify(traceparent)} u: ${userId}\t c: ${category}\t t:${tags}`)


  // // Extract the traceparent and tracestate values from the output object.
  // const { traceparent, tracestate } = contextCarrier;


  const reqBody = {
    items: [ {userId, category, tags}],
    "traceparent": traceparent,
    // "tracestate": tracestate
  }



  const theRequest = new Request(reqUrl, {
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
      "traceparent": traceparent,
    },
  });


  try{
    const res = await fetch(theRequest);
    const data = await res.json();

    return data;
  } catch (e) {
    console.error(`Unable to retrieve API data. Error thrown: ${e}`);
    throw e;
  }
}



export async function getAllItems({ traceparent, userId, category, tags }){
  let url = process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ ? process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ : "";
  // console.log(`A2. Request url: ${url}`)

  let reqUrl = url == "" ? "http://localhost:8080/listah.v1.ItemService/Read" : url
  // console.log(`A2. Request reqUrl: ${reqUrl}`)

  // Create an output object that conforms to that interface.
  const output: Carrier = {};

  propagation.inject(context.active(), output);
  console.info(`Internal Repo 1. Output object: ${JSON.stringify(output)}`);



  const reqBody = {
    items: [ {userId, category, tags}],
    "traceparent": traceparent,
    // "tracestate": tracestate
  }



  const theRequest = new Request(reqUrl, {
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
      "traceparent": traceparent,
    },
  });


  try{
    const res = await fetch(theRequest);
    const data = await res.json();

    return data;
  } catch (e) {
    console.error(`Unable to retrieve API data. Error thrown: ${e}`);
    throw e;
  }
}
