import * as z from "zod";

export interface IEnvConfig {
  apiUrl: string;
  authKey: string;
}

export interface IApiEndpointConfig {
  readItem: string;
  readTag: string;
  readFilter: string;
  updateItem: string;
  updateFilter: string;
}


export type AuditUpdaterEnum = "AUDIT_UPDATER_ENUM_UNSPECIFIED" | "AUDIT_UPDATER_ENUM_FRONTEND" | "AUDIT_UPDATER_ENUM_SYSOPS";



export interface TraceBaggage {
  traceparent?: string;
  tracestate?: string;
  b3?: string;
}

export const ZPagination = z.object({
  pageSize: z.number().catch(100),
  pageNumber: z.number().catch(1),
  sort: z.string().catch('name'),

});
export type IPagination = z.infer<typeof ZPagination>;


// export const ZCategory = z.object({
//   id: z.string().catch(''),
//   name: z.string().catch(''),
//   count: z.number().catch(1),
// });
// export type ICategory = z.infer<typeof ZCategory>;
