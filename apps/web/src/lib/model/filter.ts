import * as z from "zod";

import {
  ZPagination,
} from "@/lib/model/common";

export const ZFilter = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  tags: z.array(z.string()).catch([]),
  count: z.number().catch(0),
});
export type IFilter = z.infer<typeof ZFilter>;



export const ZFilterReadRequest = z.object({
  userId: z.string().catch(''),
  pagination: ZPagination,
});
export type IFilterReadRequest = z.infer<typeof ZFilterReadRequest>;

export const ZFilterReadResponse = z.object({
  filters: z.array(ZFilter).catch([]),
  pagination: ZPagination,
});
export type IFilterReadResponse = z.infer<typeof ZFilterReadResponse>;
