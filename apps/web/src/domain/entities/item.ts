import * as z from "zod";


import {
  ZTag,
} from "@/domain/entities/tag";


export const ZFormProps = z.object({
  key: z.string().catch(''),
  value: z.string().catch(''),
})
export type IFormProps = z.infer<typeof ZFormProps>;

// Item Definitions
export const ZFormItem = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  note: z.string().catch(""),
  props: z.array(ZFormProps).catch([]),
  tags: z.array(ZTag).catch([]),
  softDelete: z.nullish(z.boolean().catch(false)),
});
export type IFormItem = z.infer<typeof ZFormItem>;



// Item Definitions
export const ZItem = z.object({
  id: z.string().catch(''),
  userId: z.string().catch(''),
  name: z.string().catch(''),
  note: z.string().catch(""),
  tags: z.array(z.string()).catch([]),
  props: z.any(),
  tagObjs: z.nullish(z.array(ZTag)).catch([]),
  propObjs: z.nullish(z.array(ZFormProps)).catch([]),
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
