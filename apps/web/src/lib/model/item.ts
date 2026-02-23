import * as z from "zod";



// Item Definitions
export const ZItem = z.object({
  id: z.nullish(z.string()),
  userId: z.nullish(z.string()),
  title: z.nullish(z.string()),
  category: z.nullish(z.string()),
  description: z.nullish(z.string()),
  note: z.nullish(z.string()),
  tag: z.nullish(z.array(z.string())),
  softDelete: z.nullish(z.boolean()),
  reactivateAt: z.nullish(z.string()),

});
export type IItem = z.infer<typeof ZItem>;

export const ZItemRequest = z.object({
  userId: z.string().catch(''),
  filter: z.array(z.string()).catch([]),
  searchQuery: z.string().catch(''),
  pageSize: z.number().catch(100),
  pageNumber: z.number().catch(1),
  sortQuery: z.string().catch('user_id ASC, title ASC'),

});
export type IItemRequest = z.infer<typeof ZItemRequest>;

export const ZItemResponse = z.object({
  items: z.array(ZItem).catch([]),
  userId: z.string().catch(''),
  filter: z.array(z.string()).catch([]),
  searchQuery: z.string().catch(''),
  pageSize: z.number().catch(100),
  pageNumber: z.number().catch(1),
  sortQuery: z.string().catch('user_id ASC, title ASC'),
});
export type IItemResponse = z.infer<typeof ZItemResponse>;
