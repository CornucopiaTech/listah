import type {
  ChangeEvent,
  MouseEvent,
  ReactNode,
  RefObject,
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
  pageSortChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  renderRow: (idx: number) => ReactNode,
  clickRow: (idx: number) => void,
}


export type IViewItemsContext = {
  items: IItem[],
  pagination: Pagination,
  isPending: boolean,
  isError: boolean,
  error: Error | null,
  pageChange: (event: MouseEvent<HTMLButtonElement> | null, value: number) => void,
  pageSizeChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  pageSortChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  editItemClick: (idx: number) => void,
}


export type ISearchItemsContext = {
  route: string,
  search: string,
  items: IItem[],
  pagination: Pagination,
  isPending: boolean,
  isError: boolean,
  error: Error | null,
  pageChange: (event: MouseEvent<HTMLButtonElement> | null, value: number) => void,
  pageSizeChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  pageSortChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  editItemClick: (idx: number) => void,
  openDialog: boolean,
  closeDialog: () => void,
}


export type IViewTagsContext = {
  tags: ITag[],
  pagination: Pagination,
  isPending: boolean,
  isError: boolean,
  error: Error | null,
  pageChange: (event: MouseEvent<HTMLButtonElement> | null, value: number) => void,
  pageSizeChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  pageSortChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  viewItemsClick: (idx: number) => void,
  editTagClick: (idx: number) => void,
  bulkDelete: () => void,
  tagCheck: (checkedTagId: string) => void,
  checkedTagSet: RefObject<Set<string>>
}


export type IViewFiltersContext = {
  filters: IFilter[],
  pagination: Pagination,
  isPending: boolean,
  isError: boolean,
  error: Error | null,
  pageChange: (event: MouseEvent<HTMLButtonElement> | null, value: number) => void,
  pageSizeChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  pageSortChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  viewItemsClick: (idx: number) => void,
  editFilterClick: (idx: number) => void,
}
