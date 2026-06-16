import * as z from "zod";

import {
  ZPagination,
  ZSearch,
} from "@/entities/common";
import {
  DefaultTagFilterQuery,
  DefaultPagination,

} from '@/utils/defaults';



export const ZFilter = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  tags: z.array(z.string()).catch([]),
  count: z.nullish(z.number()).catch(0),
  softDelete: z.nullish(z.boolean().catch(false)),
});
export type IFilter = z.infer<typeof ZFilter>;



export const ZFilterReadRequest = z.object({
  userId: z.string().catch(''),
  query: ZSearch.catch(DefaultTagFilterQuery),
  pagination: ZPagination.catch(DefaultPagination),
});
export type IFilterReadRequest = z.infer<typeof ZFilterReadRequest>;

export const ZFilterReadResponse = z.object({
  filters: z.array(ZFilter).catch([]),
  totalRecordCount: z.number().catch(0),
  userId: z.string().catch(''),
  query: ZSearch.catch(DefaultTagFilterQuery),
  pagination: ZPagination.catch(DefaultPagination),
});
export type IFilterReadResponse = z.infer<typeof ZFilterReadResponse>;
