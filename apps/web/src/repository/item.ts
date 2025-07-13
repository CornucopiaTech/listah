
export async function fetchItems({
  _key, userId, categories, tags
}: {
  _key: string, userId: string, categories: string[], tags: string[]
}){
  const reqBody = {
    items: {
      userId: userId,
      category: categories,
      tags: tags,
    }
  }

  const theRequest = new Request("http://localhost:8080/listah.v1.ItemService/ReadFilter", {
    method: "POST",
    body: JSON.stringify({
      categoryFilter: categories,
      tagFilter: tags,
      userFilter: userId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const res = await fetch(theRequest, {
    body: JSON.stringify({
      categoryFilter: dataCategory,
      tagFilter: dataTags,
      userFilter: dataUser,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data
}
