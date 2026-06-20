import * as z from "zod";


export const ZTag = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  props: z.array(z.string()).catch([]),
  count: z.nullish(z.number()).catch(0),
  softDelete: z.nullish(z.boolean().catch(false)),
});
export type ITag = z.infer<typeof ZTag>;

export const DefaultTag: ITag = {
  id: "",
  userId: "",
  name: "",
  props: [],
  count: 0,
  softDelete: false,
}



export const ZTagProperty = z.record(
  z.string(), z.object({
    value: z.array(z.string())
  })
);
export type ITagProperty = z.infer<typeof ZTagProperty>;
