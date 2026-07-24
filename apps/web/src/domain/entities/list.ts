import type {
  ChangeEvent,
  MouseEvent,
  ReactNode,
} from 'react';



import {
  type Pagination,
} from "./pagination";
import {
  type IPagination,
} from "./pagination";
import {
  type ITag,
} from "./tag";
import {
  type IFilter,
} from "./filter";
import {
  type IItem,
} from "./item";


export type IListContext = {
  data: [],
  pagination: IPagination,
  isPending: boolean,
  isError: boolean,
  isFetching: boolean,
  error: Error | null,
  scrollIndex: number,
  pageChange: (event: MouseEvent<HTMLButtonElement> | null, value: number) => void,
  pageSizeChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  renderRow: (idx: number) => ReactNode,
  clickRow: (idx: number) => void,
}


export type IItemListContext = {
  items: IItem[],
  pagination: Pagination,
  isPending: boolean,
  isError: boolean,
  error: Error | null,
  pageChange: (event: MouseEvent<HTMLButtonElement> | null, value: number) => void,
  pageSizeChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  editItemClick: (idx: number) => void,
}


export type ITagListContext = {
  tags: ITag[],
  pagination: Pagination,
  isPending: boolean,
  isError: boolean,
  error: Error | null,
  pageChange: (event: MouseEvent<HTMLButtonElement> | null, value: number) => void,
  pageSizeChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  listItemClick: (idx: number) => void,
  viewItemsClick: (idx: number) => void,
  editTagClick: (idx: number) => void,
}


export type IFilterListContext = {
  filters: IFilter[],
  pagination: Pagination,
  isPending: boolean,
  isError: boolean,
  error: Error | null,
  pageChange: (event: MouseEvent<HTMLButtonElement> | null, value: number) => void,
  pageSizeChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  listItemClick: (idx: number) => void,
  viewItemsClick: (idx: number) => void,
  editFilterClick: (idx: number) => void,
}
