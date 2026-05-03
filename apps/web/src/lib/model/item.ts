import * as z from "zod";

import {
  ZPagination,
  ZSearch,
} from "@/lib/model/common";


// Item Definitions
export const ZItem = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  note: z.string().catch(""),
  props: z.any(),
  tags: z.array(z.string()).catch([]),
  tagIds: z.nullish(z.array(z.string())).catch([]),
  tagNames: z.nullish(z.array(z.string())).catch([]),
  propList: z.nullish(z.array(z.string())).catch([]),
  softDelete: z.nullish(z.boolean().catch(false)),
});
export type IItem = z.infer<typeof ZItem>;



export const ZItemReadRequest = z.object({
  userId: z.string().catch(''),
  query: ZSearch,
  pagination: ZPagination,

});
export type IItemReadRequest = z.infer<typeof ZItemReadRequest>;

export const ZItemReadResponse = z.object({
  items: z.array(ZItem).catch([]),
  totalRecordCount: z.number().catch(0),
  userId: z.string().catch(''),
  query: ZSearch,
  pagination: ZPagination,
});
export type IItemReadResponse = z.infer<typeof ZItemReadResponse>;
