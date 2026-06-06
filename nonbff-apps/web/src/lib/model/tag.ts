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
  count: z.nullish(z.number()).catch(0),
  softDelete: z.nullish(z.boolean().catch(false)),
});
export type ITag = z.infer<typeof ZTag>;


// export const ZTagProperty = z.object({
//   props: z.map(
//     z.string(), z.object({
//       value: z.array(z.string())
//     })
//   )
// });

export const ZTagProperty = z.record(
  z.string(), z.object({
    value: z.array(z.string())
  })
);
export type ITagProperty = z.infer<typeof ZTagProperty>;


export const ZTagReadRequest = z.object({
  userId: z.string().catch(''),
  query: ZSearch.catch(DefaultTagFilterQuery),
  pagination: ZPagination.catch(DefaultPagination),
});
export type ITagReadRequest = z.infer<typeof ZTagReadRequest>;

export const ZTagReadResponse = z.object({
  tags: z.array(ZTag).catch([]),
  tagidPropMap: ZTagProperty,
  totalRecordCount: z.number().catch(0),
  query: ZSearch.catch(DefaultTagFilterQuery),
  pagination: ZPagination.catch(DefaultPagination),
});
export type ITagReadResponse = z.infer<typeof ZTagReadResponse>;


// Tag Properties
export const ZTagPropertyReadRequest = z.object({
  userId: z.string().catch(''),
  query: ZSearch.catch(DefaultTagFilterQuery),
  pagination: ZPagination.catch(DefaultPagination),
});
export type ITagPropertyReadRequest = z.infer<typeof ZTagPropertyReadRequest>;

export const ZTagPropertyReadResponse = z.object({
  props: ZTagProperty,
  totalRecordCount: z.number().catch(0),
  query: ZSearch.catch(DefaultTagFilterQuery),
  pagination: ZPagination.catch(DefaultPagination),
});
export type ITagPropertyReadResponse = z.infer<typeof ZTagPropertyReadResponse>;
