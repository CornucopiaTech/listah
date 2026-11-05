import * as z from "zod";





export const ZReadQuery = z.object({
  userId: z.string().catch(''),
  id: z.string().catch(''),
  tags: z.array(z.string()).catch([]),
  text: z.string().catch(''),
});
export type IReadQuery = z.infer<typeof ZReadQuery>;
export const DefaultReadQuery: IReadQuery = {
  userId: "",
  id: "",
  tags: [],
  text: "",
}
