import * as z from "zod";


import {
  ZFilter,
} from "@/domain/entities/filter";
import {
  ZTag,
  ZTagProperty,
} from "@/domain/entities/tag";
import {
  ZItem,
} from "@/domain/entities/item";
import {
  ZPagination,
  DefaultPagination,
} from "@/domain/entities/pagination";
import {
  ZReadQuery,
  DefaultReadQuery
} from "./query";




export const ZEditor = z.object({
  obj: z.union([ZTag, ZFilter, ZItem]),
  flag: z.boolean(),
  modal: z.string(),
});
export type IEditor = z.infer<typeof ZEditor>;
export const DefaultEditor = {
  obj: undefined,
  flag: false,
  modal: ""
}


export const ZUrlSearch = z.object({
  p: z.string(),
  c: z.string(),
  e: z.string(),
});
export type IUrlSearch = z.infer<typeof ZUrlSearch>;



export const ZChildReadRequest = z.object({
  pagination: ZPagination,
  query: ZReadQuery,
  id: z.nullish(z.string()),
  name: z.nullish(z.string()),
});
export type IChildReadRequest = z.infer<typeof ZChildReadRequest>;

export const ZReadRequest = z.object({
  query: ZReadQuery.catch(DefaultReadQuery),
  pagination: ZPagination.catch(DefaultPagination),
});
export type IReadRequest = z.infer<typeof ZReadRequest>;
export const DefaultReadRequest: IReadRequest = {
  query: DefaultReadQuery,
  pagination: DefaultPagination,
}


export const ZItemReadResponse = z.object({
  items: z.array(ZItem).catch([]),
  query: ZReadQuery.catch(DefaultReadQuery),
  pagination: ZPagination.catch(DefaultPagination),
});
export type IItemReadResponse = z.infer<typeof ZItemReadResponse>;
export const DefaultItemReadResponse: IItemReadResponse = {
  items: [],
  query: DefaultReadQuery,
  pagination: DefaultPagination,
}


export const ZFilterReadResponse = z.object({
  filters: z.array(ZFilter).catch([]),
  query: ZReadQuery.catch(DefaultReadQuery),
  pagination: ZPagination.catch(DefaultPagination),
});
export type IFilterReadResponse = z.infer<typeof ZFilterReadResponse>;
export const DefaultFilterReadResponse: IFilterReadResponse = {
  filters: [],
  query: DefaultReadQuery,
  pagination: DefaultPagination,
}


export const ZTagReadResponse = z.object({
  tags: z.array(ZTag).catch([]),
  tagidPropMap: ZTagProperty.catch({}),
  query: ZReadQuery.catch(DefaultReadQuery),
  pagination: ZPagination.catch(DefaultPagination),
});
export type ITagReadResponse = z.infer<typeof ZTagReadResponse>;
export const DefaultReadRequestResponse: ITagReadResponse = {
  tags: [],
  tagidPropMap: {},
  query: DefaultReadQuery,
  pagination: DefaultPagination,
}


export const ZTagPropertyReadResponse = z.object({
  props: z.array(ZTagProperty).catch([]),
  query: ZReadQuery.catch(DefaultReadQuery),
  pagination: ZPagination.catch(DefaultPagination),
});
export type ITagPropertyReadResponse = z.infer<typeof ZTagPropertyReadResponse>;
export const DefaultTagPropertyReadResponse: ITagPropertyReadResponse = {
  props: [],
  query: DefaultReadQuery,
  pagination: DefaultPagination,
}
