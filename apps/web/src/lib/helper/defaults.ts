
import type { IItem, IItemsSearch } from '@/lib/model/Items';
import type { IApiEndpointConfig } from '@/lib/model/common';
import type { IUser } from '@/lib/model/auth';


export const DefaultQueryParams: IItemsSearch = {
  userId: undefined,
  categoryFilter: [],
  tagFilter: [],
  pageNumber: 0,
  pageSize: 25,
  searchQuery: '',
  fromDate: "",
  toDate: "",
  sortQuery: '',
};


export const ITEMS_URL: string = '/items/';


export const PAGE_SIZE_OPTIONS: {label: number, value: number}[] = [
  { label: 10, value: 10 }, { label: 25, value: 25 },
  { label: 50, value: 50 }, { label: 100, value: 100 }
]


export const DEFAULT_USER: IUser = {
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: null,
  userName: '',
  password: null,
  role: [],
};

export const DEFAULT_ITEM: IItem = {
  id: "",
  userId: "",
  summary: "",
  category: "",
  description: "",
  note: "",
  tag: [],
  softDelete: false,
  // properties: {},
  // reactivateAt: null,
  // audit: null,
};

export const MAX_TAG_CHIPS_DISPLAY = 2;

export const MAX_ITEM_SUMMARY_LENGTH = 100;
export const MAX_ITEM_GRID_SUMMARY_LENGTH = 50;

export const ITEM_LIST_HEIGHT = 30;
export const MAX_ITEM_CATEGORY_LIST_HEIGHT = 600;
export const MAX_ITEM_LIST_HEIGHT = 700;
export const ITEM_CATEGORY_LIST_HEIGHT_BUFFER = 60;

export const API_ENDPOINTS: IApiEndpointConfig = {
  readItem: "listah.v1.ItemService/Read",
  updateItem: "listah.v1.ItemService/Update",
  readCategory: "istah.v1.CategoryService/Read",
  readTag: "istah.v1.TagService/Read",
}
