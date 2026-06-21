

import type {
  IApiEndpointConfig,
} from '@/domain/entities';




export const ListBoxSize: {
  height: string, width: string
} = {
  height: `calc(100vh - 225px)`, width: '100%',
}

export const AppBarHeight = 32;
export const AppDrawerWidth = 128;

export const QueryStaleTime = process.env.NODE_ENV === "production" ? 24 * 60 * 60 * 1000 : 10;


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
