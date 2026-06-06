import * as z from "zod";

import {
  ZPagination,
  ZSearch,
} from "@/lib/model/common";
import { ZFilter } from "@/lib/model/filter";
import { ZTag } from "@/lib/model/tag";
import {
  DefaultTagFilterQuery,
  DefaultPagination,

} from '@/lib/helper/defaults';


export const ZFormProps = z.object({ key: z.string().catch(''), value: z.string().catch(''), })
export type IFormProps = z.infer<typeof ZFormProps>;

// Item Definitions
export const ZFormItem = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  note: z.string().catch(""),
  props: z.array(ZFormProps).catch([]),
  tags: z.array(ZTag).catch([]),
  softDelete: z.nullish(z.boolean().catch(false)),
});
export type IFormItem = z.infer<typeof ZFormItem>;



// Item Definitions
export const ZItem = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  note: z.string().catch(""),
  tags: z.array(z.string()).catch([]),
  props: z.any(),
  tagObjs: z.nullish(z.array(ZTag)).catch([]),
  propObjs: z.nullish(z.array(ZFormProps)).catch([]),
  softDelete: z.nullish(z.boolean().catch(false)),
});
export type IItem = z.infer<typeof ZItem>;




export const ZItemReadRequest = z.object({
  userId: z.string().catch(''),
  query: ZSearch.catch(DefaultTagFilterQuery),
  pagination: ZPagination.catch(DefaultPagination),

});
export type IItemReadRequest = z.infer<typeof ZItemReadRequest>;



export const ZItemRouteSearch = z.object({
  query: ZItemReadRequest,
  title: z.nullish(z.string()).catch('All Items'),
  refTag: z.union([z.undefined(), ZTag]),
  refFilter: z.union([z.undefined(), ZFilter]),
});
export type IItemRouteSearch = z.infer<typeof ZItemRouteSearch>;



export const ZItemReadResponse = z.object({
  items: z.array(ZItem).catch([]),
  totalRecordCount: z.number().catch(0),
  userId: z.string().catch(''),
  query: ZSearch,
  pagination: ZPagination,
});
export type IItemReadResponse = z.infer<typeof ZItemReadResponse>;
