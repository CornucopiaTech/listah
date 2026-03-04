import * as z from "zod";



// Item Definitions
export const ZItem = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  title: z.string().catch(''),
  category: z.string().catch(''),
  description: z.string().catch(''),
  note: z.string().catch(''),
  tag: z.array(z.string()).catch([]),
  softDelete: z.boolean().catch(false),
  reactivateAt: z.string().catch(''),

});
export type IItem = z.infer<typeof ZItem>;

export const ZItemReadRequest = z.object({
  userId: z.string().catch(''),
  tags: z.array(z.string()).catch([]),
  savedFilters: z.array(z.string()).catch([]),
  searchQuery: z.string().catch(''),
  pageSize: z.number().catch(100),
  pageNumber: z.number().catch(1),
  sortQuery: z.string().catch('user_id ASC, title ASC'),

});
export type IItemReadRequest = z.infer<typeof ZItemReadRequest>;

export const ZItemReadResponse = z.object({
  items: z.array(ZItem).catch([]),
  userId: z.string().catch(''),
  tags: z.array(z.string()).catch([]),
  savedFilters: z.array(z.string()).catch([]),
  searchQuery: z.string().catch(''),
  pageSize: z.number().catch(100),
  pageNumber: z.number().catch(1),
  sortQuery: z.string().catch('user_id ASC, title ASC'),
});
export type IItemReadResponse = z.infer<typeof ZItemReadResponse>;
