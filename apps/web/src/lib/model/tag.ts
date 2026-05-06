import * as z from "zod";

import {
  ZPagination,
  ZSearch,
} from "@/lib/model/common";
import {
  DefaultTagFilterQuery,
  DefaultPagination,

} from '@/lib/helper/defaults';



export const ZTag = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  props: z.array(z.string()).catch([]),
  count: z.number().catch(0),
});
export type ITag = z.infer<typeof ZTag>;


export const ZTagReadRequest = z.object({
  userId: z.string().catch(''),
  query: ZSearch.catch(DefaultTagFilterQuery),
  pagination: ZPagination.catch(DefaultPagination),
});
export type ITagReadRequest = z.infer<typeof ZTagReadRequest>;

export const ZTagReadResponse = z.object({
  tags: z.array(ZTag).catch([]),
  totalRecordCount: z.number().catch(0),
  query: ZSearch.catch(DefaultTagFilterQuery),
  pagination: ZPagination.catch(DefaultPagination),
});
export type ITagReadResponse = z.infer<typeof ZTagReadResponse>;
