import * as z from "zod";


import {
  ZFilter,
  DefaultFilter,
} from "@/domain/entities/filter";
import {
  ZTag,
  ZTagProperty,
  DefaultTag,
} from "@/domain/entities/tag";
import {
  ZItem,
  DefaultItem,
} from "@/domain/entities/item";
import {
  ZPagination,
  DefaultPagination,
} from "@/domain/entities/pagination";
import {
  ZReadQuery,
  DefaultReadQuery
} from "./query";




export const ZReadEditor = z.object({
  flag: z.nullish(z.boolean()).catch(false),
  tag: z.nullish(z.string()),
  filter: z.nullish(z.string()),
  item: z.nullish(z.string()),
});
export type IReadEditor = z.infer<typeof ZReadEditor>;
export const DefaultReadEditor: IReadEditor = {
  flag: undefined,
  item: undefined,
  tag: undefined,
  filter: undefined,
}


export const ZReadReference = z.object({
  tag: ZTag.catch(DefaultTag),
  filter: ZFilter.catch(DefaultFilter),
});
export type IReadReference = z.infer<typeof ZReadReference>;
export const DefaultReadReference: IReadReference = {
  tag: DefaultTag,
  filter: DefaultFilter,
}


export const ZReadRequest = z.object({
  query: ZReadQuery.catch(DefaultReadQuery),
  pagination: ZPagination.catch(DefaultPagination),
  reference: z.nullish(ZReadReference),
  title: z.nullish(z.string()),
  editor: z.nullish(ZReadEditor),
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
