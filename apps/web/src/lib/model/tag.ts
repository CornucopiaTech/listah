import * as z from "zod";

import {
  ZPagination,
} from "@/lib/model/common";



export const ZTag = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  // props: z.array(z.string()).catch([]),
  count: z.number().catch(0),
});
export type ITag = z.infer<typeof ZTag>;


export const ZTagReadRequest = z.object({
  userId: z.string().catch(''),
  pagination: ZPagination,
});
export type ITagReadRequest = z.infer<typeof ZTagReadRequest>;

export const ZTagReadResponse = z.object({
  tags: z.array(ZTag).catch([]),
  pagination: ZPagination,
});
export type ITagReadResponse = z.infer<typeof ZTagReadResponse>;
