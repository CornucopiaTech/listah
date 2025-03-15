
import MyData from './fake_data_w_props.json';
import type { ItemModelInterface } from '~/model/items';

let AppData: ItemModelInterface[];


export function setAppData() {
  if (AppData === undefined) {
    AppData = [...MyData].slice(0, 50);
  }
}

export function getDemoItems(dataCategory: string[], dataTags: string[], dataUser: string[]) {
  setAppData();
  return AppData;

}

export async function getItems(dataCategory: string[], dataTags: string[], dataUser: string[]) {
  const theRequest = new Request("http://localhost:8080/listah.v1.ItemService/ReadFilter", {
    method: "POST",
    body: JSON.stringify({
      categoryFilter: dataCategory,
      tagFilter: dataTags,
      userFilter: dataUser,
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

export function getAllCategories(): string[] {
  setAppData();
  return Array.from(new Set(AppData.map((item: ItemModelInterface) => item.category)));
}

export function getAllTags(): string[] {
  setAppData();
  return Array.from(new Set(AppData.map((item: ItemModelInterface) => item.tags).flat()));
}

export function getSelectedItem(itemId: string): ItemModelInterface | undefined {
  setAppData();
  return AppData.find((anItem: ItemModelInterface) => anItem.id === itemId);
}

export function addTagstoItem(itemId: string, tags: string | string[]) {
  setAppData();
  try{
    let theitem: ItemModelInterface | undefined = AppData.find((anItem: ItemModelInterface) => anItem.id === itemId);
    let appendTags = typeof tags === "string" ? [tags] : tags
    theitem.tags = theitem.tags.concat(appendTags);
  } catch (error) {
    console.log(error);
  }

}

export function saveUpdatesToItem(updatedItem: ItemModelInterface) {
  setAppData();
  try{
    let itemIndex: number = AppData.findIndex((anItem: ItemModelInterface) => anItem.id === updatedItem.id);
    AppData[itemIndex] = updatedItem;
  } catch (error) {
    console.log(error);
  }

}
