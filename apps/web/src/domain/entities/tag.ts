import * as z from "zod";
import type {
  ChangeEvent,
  MouseEvent,
  ReactNode
} from 'react';


import type {
  IReadQuery,
} from "./query";
import {
  type Pagination,
} from "./pagination";


export const ZTag = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  props: z.array(z.string()).catch([]),
  count: z.nullish(z.number()).catch(0),
  softDelete: z.nullish(z.boolean().catch(false)),
});
export type ITag = z.infer<typeof ZTag>;

export const DefaultTag: ITag = {
  id: "",
  userId: "",
  name: "",
  props: [],
  count: 0,
  softDelete: false,
}



export const ZTagProperty = z.record(
  z.string(), z.object({
    value: z.array(z.string())
  })
);
export type ITagProperty = z.infer<typeof ZTagProperty>;


export type ITagDataContext = {
  query: IReadQuery,
  tags: ITag[],
  pagination: Pagination,
  isPending: boolean,
  isError: boolean,
  isFetching: boolean,
  error: Error | null,
  pageChange: (event: MouseEvent<HTMLButtonElement> | null, value: number) => void,
  pageSizeChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  listItemClick: (idx: number) => ReactNode,
}
