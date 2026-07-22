

import type {
  IApiEndpointConfig,
} from '@/domain/entities';






export const AppBarHeight = 48;
export const AppDrawerWidth = 240;
export const AppBarBottom = 0;
export const AppPageAllowance = AppBarHeight + AppBarBottom;
export const AppPageContentHeight = `calc(100vh - ${AppPageAllowance}px) - 10px`;

export const ListBoxSize: {
  height: string, width: string, overflowY: string
} = {
  height: `calc(${AppPageContentHeight} - 120px)`,
  // height: `calc(100vh - 250px)`,
  width: '100%', overflowY: 'auto',    // Enables scrolling when content overflows
}

// export const ListItemStyling = { height: "fit-content", maxHeight: "50px" };
export const ListItemStyling = { height: "fit-content" };



// ToDo: change query time to dev time again
// export const QueryStaleTime = process.env.NODE_ENV === "production" ? 24 * 60 * 60 * 1000 : 10;
export const QueryStaleTime = process.env.NODE_ENV === "production" ? 24 * 60 * 60 * 1000 : 60 * 1000;


export const PAGE_SIZE_OPTIONS: { label: number, value: number }[] = [
  { label: 10, value: 10 }, { label: 25, value: 25 },
  { label: 50, value: 50 }, { label: 100, value: 100 }
]

export const ApiEndpoints: IApiEndpointConfig = {
  readItem: "listah.v1.ItemService/ReadItem",
  readTag: "listah.v1.ItemService/ReadTag",
  readTagProperty: "listah.v1.ItemService/ReadTagProperty",
  readFilter: "listah.v1.ItemService/ReadFilter",
  updateTag: "listah.v1.ItemService/UpsertTag",
  updateItem: "listah.v1.ItemService/UpsertItem",
  updateFilter: "listah.v1.ItemService/UpsertFilter",
}
