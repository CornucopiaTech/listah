import type {
  ChangeEvent,
  MouseEvent,
  ReactNode,
} from 'react';




import type {
  IReadQuery,
} from "./query";
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


export type ITagListContext = {
  // query: IReadQuery,
  tags: ITag[],
  pagination: Pagination,
  isPending: boolean,
  isError: boolean,
  error: Error | null,
  pageChange: (event: MouseEvent<HTMLButtonElement> | null, value: number) => void,
  pageSizeChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  listItemClick: (idx: number) => ReactNode,


  // childQuery: IReadQuery,
  items: IItem[],
  childPagination: Pagination,
  childIsPending: boolean,
  childIsError: boolean,
  childError: Error | null,
  childPageChange: (event: MouseEvent<HTMLButtonElement> | null, value: number) => void,
  childPageSizeChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  childListItemClick: (idx: number) => ReactNode,


}
