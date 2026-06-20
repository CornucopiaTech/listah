import * as z from "zod";


import {
  ZTag,
} from "@/domain/entities/tag";


export const ZItemFormProps = z.object({
  key: z.string().catch(''),
  value: z.string().catch(''),
})
export type IItemFormProps = z.infer<typeof ZItemFormProps>;

// Item Definitions
export const ZItemForm = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  note: z.string().catch(""),
  props: z.array(ZItemFormProps).catch([]),
  tags: z.array(ZTag).catch([]),
  softDelete: z.nullish(z.boolean().catch(false)),
});
export type IItemForm = z.infer<typeof ZItemForm>;



// Item Definitions
export const ZItem = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  note: z.string().catch(""),
  tags: z.array(z.string()).catch([]),
  props: z.any(),
  tagObjs: z.nullish(z.array(ZTag)).catch([]),
  propObjs: z.nullish(z.array(ZItemFormProps)).catch([]),
  softDelete: z.nullish(z.boolean().catch(false)),
});
export type IItem = z.infer<typeof ZItem>;
export const DefaultItem = {
  id: "",
  userId: "",
  name: "",
  note: "",
  tags: [],
  props: {},
  tagObjs: [],
  propObjs: [],
  softDelete: false,
}
