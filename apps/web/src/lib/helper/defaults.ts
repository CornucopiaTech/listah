
import type {
  IPagination,
} from "@/lib/model/common";
import type {
  IItem,
  IItemReadRequest
} from '@/lib/model/item';
// import type {
//   THomeQueryParams
// } from '@/lib/model/home';
import type { ITagReadRequest } from '@/lib/model/tag';
import type { IFilterReadRequest } from '@/lib/model/filter';


import type { IApiEndpointConfig } from '@/lib/model/common';
import type { IUser } from '@/lib/model/auth';


export const AppBarHeight = 64;

const defaultPagination: IPagination = {
  pageSize: 100,
  pageNumber: 0,
  sort: '',
}

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
  props: new Map<string, any>(),
  tags: [],
  softDelete: false,
};

export const DefaultItemRead: IItemReadRequest = {
  userId: "",
  query: { filters: [], tags: [], text: '', },
  pagination: { ...defaultPagination }

};

export const DefaultTagRead: ITagReadRequest = {
  userId: "", pagination: { ...defaultPagination }
};

export const DefaultFilterRead: IFilterReadRequest = {
  userId: "", pagination: { ...defaultPagination }
};




export const ITEMS_URL: string = '/items/';


export const PAGE_SIZE_OPTIONS: { label: number, value: number }[] = [
  { label: 10, value: 10 }, { label: 25, value: 25 },
  { label: 50, value: 50 }, { label: 100, value: 100 }
]



export const API_ENDPOINTS: IApiEndpointConfig = {
  readItem: "listah.v1.ItemService/ReadItem",
  readTag: "listah.v1.ItemService/ReadTag",
  readFilter: "listah.v1.ItemService/ReadFilter",
  updateItem: "listah.v1.ItemService/UpsertItem",
  updateFilter: "listah.v1.ItemService/UpsertFilter",
}
