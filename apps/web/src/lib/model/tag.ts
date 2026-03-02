import * as z from "zod";



// Tag Definitions
export const ZTagCategory = z.object({
  category: z.nullish(z.string()),
  rowCount: z.number().catch(1),
});
export type ITagCategory = z.infer<typeof ZTagCategory>;


export const ZTagCategoryReadRequest = z.object({
  userId: z.string().catch(''),
  pageSize: z.number().catch(100),
  pageNumber: z.number().catch(1),
  sortQuery: z.string().catch('category ASC'),

});
export type ITagCategoryReadRequest = z.infer<typeof ZTagCategoryReadRequest>;

export const ZTagCategoryReadResponse = z.object({
  categories: z.array(ZTagCategory).catch([]),
  userId: z.string().catch(''),
  pageSize: z.number().catch(100),
  pageNumber: z.number().catch(1),
  sortQuery: z.string().catch('category ASC'),
});
export type ITagCategoryReadResponse = z.infer<typeof ZTagCategoryReadResponse>;


