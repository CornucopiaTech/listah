

import * as z from "zod";


export const ZFilter = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  tags: z.array(z.string()).catch([]),
  count: z.nullish(z.number()).catch(0),
  softDelete: z.nullish(z.boolean().catch(false)),
  tempUpdatedAt: z.nullish(z.date()).catch(new Date()),
  updatedAt: z.string().catch(""),
});
export type IFilter = z.infer<typeof ZFilter>;

export const ZFilters = z.array(ZFilter);
export type IFilters = z.infer<typeof ZFilters>;

export const DefaultFilter: IFilter = {
  id: '',
  userId: '',
  name: '',
  tags: [],
  count: 0,
  softDelete: false,
  updatedAt: "",
}
