import type { ItemModelInterface } from '@/model/items';


export function getItems(items: ItemModelInterface){

}


export async function fetchItems({
  _key, userId, categories, tags
}: {
  _key: string, userId: string, categories: string[], tags: string[]
}){
  const reqBody = {
    items: [
      { userId: userId, category: categories, tags: tags }
    ]
  }

  const requrl = process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ ? process.env.NEXT_PUBLIC_LISTAH_API_ITEMS_READ : "";
  const theRequest = new Request(requrl, {
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json",
    },
  });

  try{
    const res = await fetch(theRequest);
    const data = await res.json();
    return data
  } catch (e) {
    console.error(`Unable to retrieve API data. Error thrown: f{e}`);
  }
}
