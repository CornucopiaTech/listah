import * as z from "zod";

import {
  ZPagination,
  ZSearch,
} from "@/lib/model/common";



export const ZTag = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  count: z.number().catch(0),
});
export type ITag = z.infer<typeof ZTag>;


export const ZTagReadRequest = z.object({
  userId: z.string().catch(''),
  query: ZSearch,
  pagination: ZPagination,
});
export type ITagReadRequest = z.infer<typeof ZTagReadRequest>;

export const ZTagReadResponse = z.object({
  tags: z.array(ZTag).catch([]),
  totalRecordCount: z.number().catch(0),
  query: ZSearch,
  pagination: ZPagination,
});
export type ITagReadResponse = z.infer<typeof ZTagReadResponse>;
