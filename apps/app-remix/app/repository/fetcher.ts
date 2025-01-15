
// import MyData from './fake_data.json';
import MyData from './fake_data_w_props.json';
import type { ItemModelInterface } from '~/model/items';

let AppData: ItemModelInterface[];


export function setAppData() {
  if (AppData === undefined) {
    AppData = [...MyData].slice(0, 10);
  }
}
export function getItems(dataCategory: string[], dataTags: string[], dataUser: string): ItemModelInterface[] {
  setAppData();
  return AppData;
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
    Object.assign(AppData.find((anItem: ItemModelInterface) => anItem.id === updatedItem.id), updatedItem);
  } catch (error) {
    console.log(error);
  }

}
