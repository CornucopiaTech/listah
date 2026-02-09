import * as z from "zod";

import { ZPagination } from "@/lib/model/common";


export const ZTagRequest = z.object({
  userId: z.string().catch(''),
  pagination: ZPagination.nullish(),
});
export interface ITagRequest extends z.infer<typeof ZTagRequest>{ }; // eslint-disable-line @typescript-eslint/no-empty-object-type


export const ZTagResponse = z.object({
  tag: z.array(z.string()).catch([]),
  pagination: z.nullish(z.object({
    pageNumber: z.number().catch(1),
    recordsPerPage: z.number().catch(10),
    sortCondition: z.string().catch(''),
  })),
  totalRecordCount: z.nullish(z.number().catch(0)),
});
export interface ITagResponse extends z.infer<typeof ZTagResponse>{ }; // eslint-disable-line @typescript-eslint/no-empty-object-type

