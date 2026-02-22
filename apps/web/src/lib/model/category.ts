import * as z from "zod";



// Category Definitions
export const ZCategory = z.object({
  category: z.nullish(z.string()),
  rowCount: z.number().catch(1),
});
export type ICategory = z.infer<typeof ZCategory>;

export const ZCategoryRequest = z.object({
  userId: z.string().catch(''),
  filter: z.array(z.string()).catch([]),
  searchQuery: z.string().catch(''),
  pageSize: z.number().catch(100),
  pageNumber: z.number().catch(1),
  sortQuery: z.string().catch('category ASC'),

});
export type ICategoryRequest = z.infer<typeof ZCategoryRequest>;

export const ZCategoryResponse = z.object({
  categories: z.array(ZCategory).catch([]),
  userId: z.string().catch(''),
  filter: z.array(z.string()).catch([]),
  searchQuery: z.string().catch(''),
  pageSize: z.number().catch(100),
  pageNumber: z.number().catch(1),
  sortQuery: z.string().catch('category ASC'),
});
export type ICategoryResponse = z.infer<typeof ZCategoryResponse>;
