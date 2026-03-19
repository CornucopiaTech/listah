import * as z from "zod";

import {
  ZPagination,
} from "@/lib/model/common";

// Item Definitions
export const ZItem = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  props: z.map(z.string(), z.any()),
  tags: z.array(z.string()).catch([]),
  softDelete: z.boolean().catch(false),
});
export type IItem = z.infer<typeof ZItem>;


// Item Definitions
export const ZSearch = z.object({
  tags: z.array(z.string()).catch([]),
  filters: z.array(z.string()).catch([]),
  text: z.string().catch(''),
});
export type ISearch = z.infer<typeof ZSearch>;


export const ZItemReadRequest = z.object({
  userId: z.string().catch(''),
  query: ZSearch,
  pagination: ZPagination,

});
export type IItemReadRequest = z.infer<typeof ZItemReadRequest>;

export const ZItemReadResponse = z.object({
  items: z.array(ZItem).catch([]),
  userId: z.string().catch(''),
  query: ZSearch,
  pagination: ZPagination,
});
export type IItemReadResponse = z.infer<typeof ZItemReadResponse>;
