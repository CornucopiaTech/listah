
import type { ItemsProto, IItemsSearch } from '@/lib/model/ItemsModel';

export const DefaultQueryParams: IItemsSearch = {
  userId: undefined,
  categoryFilter: [],
  tagFilter: [],
  pageNumber: 1,
  pageSize: 20,
  searchQuery: '',
  fromDate: "",
  toDate: "",
  sortQuery: '',
};


export const ITEMS_URL: string = '/items/';


export const PAGE_SIZE_OPTIONS: {label: number, value: number}[] = [
  { label: 10, value: 10 }, { label: 20, value: 20 },
  { label: 50, value: 50 }, { label: 100, value: 100 }
]
