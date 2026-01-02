
import type { ZItems, IItemsSearch } from '@/lib/model/Items';
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

export const MAX_TAG_CHIPS_DISPLAY = 3;
