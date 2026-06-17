

import type {
  IItem,
  IItemReadRequest,
  IItemRouteSearch,
} from '@/domain/entities/item';
import type {
  ITagReadRequest,
  ITag,
} from '@/domain/entities/tag';
import type {
  IFilterReadRequest,
  IFilter,
} from '@/domain/entities/filter';
import type {
  IApiEndpointConfig,
  ISearch,
  IPagination,
} from '@/domain/entities/common';





export const ListBoxSize: {
  height: string, width: string
} = {
  height: `calc(100vh - 180px)`, width: '100%',
}

export const AppBarHeight = 32;
export const AppDrawerWidth = 128;

export const QueryStaleTime = process.env.NODE_ENV === "production" ? 24 * 60 * 60 * 1000 : 10;


export const DefaultPagination: IPagination = {
  pageSize: 1000,
  pageNumber: 1,
  sort: 'name',
  totalRecords: 0,
}

export const DefaultTagFilterQuery: ISearch = { filters: [], tags: [], text: '', }


export const DefaultItem: IItem = {
  id: "",
  userId: "",
  name: "",
  note: "",
  props: null,
  tags: [],
  tagObjs: [],
  propObjs: [],
  softDelete: false,
};

export const DefaultTag: ITag = {
  id: "",
  userId: "",
  name: "",
  props: [],
  count: 0,
  softDelete: false,
};

export const DefaultFilter: IFilter = {
  id: "",
  userId: "",
  name: "",
  tags: [],
  count: 0,
  softDelete: false,
};



export const DefaultItemRead: IItemReadRequest = {
  userId: "",
  query: { filters: [], tags: [], text: '', },
  pagination: { ...DefaultPagination }
};

export const DefaultIItemRouteSearch: IItemRouteSearch = {
  query: { ...DefaultItemRead },
  title: undefined,
  refTag: undefined,
  refFilter: undefined,
};

export const DefaultTagRead: ITagReadRequest = {
  userId: "",
  query: { filters: [], tags: [], text: '', },
  pagination: { ...DefaultPagination }
} as const;

export const DefaultFilterRead: IFilterReadRequest = {
  userId: "",
  query: { filters: [], tags: [], text: '', },
  pagination: { ...DefaultPagination }
};

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
