import type { ItemModelInterface } from '@/model/items';


export function getItems(items: ItemModelInterface){

}


export async function fetchItems({
  // _key,
  userId, category, tags
}: {
  // _key: string,
  userId: string, category: string, tags: string[]
}){
  const reqBody = {
    items: [ {userId, category, tags}]
  }

  const requrl = process.env.VITE_LISTAH_API_ITEMS_READ ? process.env.VITE_LISTAH_API_ITEMS_READ : "";
  const theRequest = new Request(requrl, {
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json",
    },
  });

  try{
    const res = await fetch(theRequest);
    return await res.json();
    // console.log(data);
    // return data;
  } catch (e) {
    console.error(`Unable to retrieve API data. Error thrown: ${e}`);
    throw e;
  }
}
