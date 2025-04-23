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
    const res = await fetch(theRequest, {
      // body: JSON.stringify({
      //   categoryFilter: dataCategory,
      //   tagFilter: dataTags,
      //   userFilter: dataUser,
      // }),
      // headers: {
      //   "Content-Type": "application/json",
      // },
    });
    const data = await res.json();
    return data
  } catch (e) {
    console.error(`Unable to retrieve API data. Error thrown: f{e}`);
  }

  // const response = await fetch('/todos/' + todoId)
  // if (!response.ok) {
  //   throw new Error('Network response was not ok')
  // }
  // return response.json()
}
// export function fetchItems(userId: string, categories: string[], tags: string[]){

// }

// t6sDDmU%nxWBtQTCk!Ra
