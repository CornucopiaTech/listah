import type {
  ChangeEvent,
  MouseEvent,
  ReactNode,
} from 'react';

import {
  type IPagination,
} from "./pagination";
// import {
//   type ITag,
// } from "./tag";
// import {
//   type IFilter,
// } from "./filter";
// import {
//   type IItem,
// } from "./item";


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
