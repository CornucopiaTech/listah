import * as z from "zod";

import { ZPagination } from "@/lib/model/common";


export const ZCategoryRequest = z.object({
  userId: z.string().catch(''),
  pagination: ZPagination.nullish(),
});
export type ICategoryRequest = z.infer<typeof ZCategoryRequest>; // eslint-disable-line @typescript-eslint/no-empty-object-type


export const ZCategoryResponse = z.object({
  category: z.array(z.string()).catch([]),
  pagination: z.nullish(z.object({
    pageNumber: z.number().catch(1),
    recordsPerPage: z.number().catch(10),
    sortCondition: z.string().catch(''),
  })),
  totalRecordCount: z.nullish(z.number().catch(0)),
});
export type ICategoryResponse = z.infer<typeof ZCategoryResponse>; // eslint-disable-line @typescript-eslint/no-empty-object-type

