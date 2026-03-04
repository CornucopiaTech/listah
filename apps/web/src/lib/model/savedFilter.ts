import * as z from "zod";



// SavedFilter Definitions
export const ZSavedFilter = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  tags: z.array(z.string()).catch([]),
  savedFilters: z.array(z.string()).catch([]),
});
export type ISavedFilter = z.infer<typeof ZSavedFilter>;



export const ZSavedFilterCategory = z.object({
  id: z.string().catch(''),
  category: z.string().catch(''),
  rowCount: z.number().catch(1),
});
export type ISavedFilterCategory = z.infer<typeof ZSavedFilterCategory>;


export const ZSavedFilterCategoryReadRequest = z.object({
  userId: z.string().catch(''),
  pageSize: z.number().catch(100),
  pageNumber: z.number().catch(1),
  sortQuery: z.string().catch('category ASC'),

});
export type ISavedFilterCategoryReadRequest = z.infer<typeof ZSavedFilterCategoryReadRequest>;

export const ZSavedFilterCategoryReadResponse = z.object({
  categories: z.array(ZSavedFilterCategory).catch([]),
  userId: z.string().catch(''),
  pageSize: z.number().catch(100),
  pageNumber: z.number().catch(1),
  sortQuery: z.string().catch('category ASC'),
});
export type ISavedFilterCategoryReadResponse = z.infer<typeof ZSavedFilterCategoryReadResponse>;


