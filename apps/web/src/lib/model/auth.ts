import * as z from "zod";


export const ZUser = z.object({
  id: z.nullish(z.string()),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phoneNumber: z.nullish(z.string()),
  role: z.nullish(z.array(z.string())),
  userName: z.string(),
  password: z.nullish(z.string()),
});


export interface IUser extends z.infer<typeof ZUser>{};


export const ZPermissions = z.object({
  role: z.string(),
  grants: z.array(z.string()),
  isAdmin: z.boolean(),
});
export interface IPermissions extends z.infer<typeof ZPermissions>{}
