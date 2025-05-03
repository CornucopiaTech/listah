import '@/envConfig.ts';
import type { ItemModelInterface } from '@/model/items';


export function getItems(items: ItemModelInterface){

}


export async function fetchItems(qKey){
  let url = process.env.VITE_LISTAH_API_ITEMS_READ ? process.env.VITE_LISTAH_API_ITEMS_READ : "";
  console.log(`A2. Request url: ${url}`)

  let reqUrl = url == "" ? "http://localhost:8080/listah.v1.ItemService/Read" : url
  console.log(`A2. Request reqUrl: ${reqUrl}`)


  console.log(`A2. Fetcher function Parameters: qKey`)
  console.log(qKey)
  const {queryKey} = qKey;
  const {userId, category, tags} = queryKey[1];
  console.log(`A2. function Parameters: u: ${userId}\t c: ${category}\t t:${tags}`)


  const reqBody = {
    items: [ {userId, category, tags}]
  }

  console.log(`A2. Request body: `);
  console.log(reqBody);


  const theRequest = new Request(reqUrl, {
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(`A2. theRequest: `);
  console.log(theRequest);

  try{
    const res = await fetch(theRequest);
    console.log('A2. Fetch Items Response: ')
    console.log(res);
    return await res.json();
    // console.log(data);
    // return data;
  } catch (e) {
    console.error(`Unable to retrieve API data. Error thrown: ${e}`);
    throw e;
  }
}
