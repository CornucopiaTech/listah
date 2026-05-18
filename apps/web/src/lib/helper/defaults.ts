
import type {
  IPagination,
} from "@/lib/model/common";
import type {
  IItem,
  IItemReadRequest,
  IItemRouteSearch,
} from '@/lib/model/item';
import type { ITagReadRequest } from '@/lib/model/tag';
import type { IFilterReadRequest } from '@/lib/model/filter';


import type { IApiEndpointConfig, ISearch } from '@/lib/model/common';
import type { IUser } from '@/lib/model/auth';
import type {
  ITag,
} from "@/lib/model/tag";
import type {
  IFilter,
} from "@/lib/model/filter";



export const ListBoxSize: {
  height: string, width: string
} = {
  height: `calc(100vh - 150px)`, width: '100%',
}

export const AppBarHeight = 32;
export const AppDrawerWidth = 128;


const defaultPagination: IPagination = {
  pageSize: 100,
  pageNumber: 0,
  sort: 'name',
}

export const DefaultPagination: IPagination = {
  pageSize: 100,
  pageNumber: 0,
  sort: 'name',
}

export const DefaultTagFilterQuery: ISearch = { filters: [], tags: [], text: '', }

export const DefaultUser: IUser = {
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: null,
  userName: '',
  password: null,
  role: [],
};

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
};

export const DefaultFilter: IFilter = {
  id: "",
  userId: "",
  name: "",
  tags: [],
  count: 0,
};



export const DefaultItemRead: IItemReadRequest = {
  userId: "",
  query: { filters: [], tags: [], text: '', },
  pagination: { ...defaultPagination }
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
  pagination: { ...defaultPagination }
} as const;

export const DefaultFilterRead: IFilterReadRequest = {
  userId: "",
  query: { filters: [], tags: [], text: '', },
  pagination: { ...defaultPagination }
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
