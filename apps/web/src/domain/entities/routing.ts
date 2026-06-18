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
} from "@/domain/entities/item";
import {
  ZPagination,
  DefaultPagination,
} from "@/domain/entities/pagination";



export const ZReadQuery = z.object({
  userId: z.string().catch(''),
  tags: z.array(z.string()).catch([]),
  text: z.string().catch(''),
});
export type IReadQuery = z.infer<typeof ZReadQuery>;
export const DefaultReadQuery: IReadQuery = {
  userId: "",
  tags: [],
  text: "",
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
  reference: z.nullish(ZReadReference).catch(DefaultReadReference),
  title: z.nullish(z.string()).catch(""),
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
  reference: z.nullish(ZReadReference).catch(DefaultReadReference),
  title: z.nullish(z.string()).catch(""),
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
  reference: z.nullish(ZReadReference).catch(DefaultReadReference),
  title: z.nullish(z.string()).catch(""),
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
  reference: z.nullish(ZReadReference).catch(DefaultReadReference),
  title: z.nullish(z.string()).catch(""),
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
  reference: z.nullish(ZReadReference).catch(DefaultReadReference),
  title: z.nullish(z.string()).catch(""),
});
export type ITagPropertyReadResponse = z.infer<typeof ZTagPropertyReadResponse>;
export const DefaultTagPropertyReadResponse: ITagPropertyReadResponse = {
  props: [],
  query: DefaultReadQuery,
  pagination: DefaultPagination,
}
