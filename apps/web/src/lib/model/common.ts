import * as z from "zod";

export interface IEnvConfig {
  apiUrl: string;
  authKey: string;
}

export interface IApiEndpointConfig {
  readTag: string;
  readTagProperty: string;
  readItem: string;
  readFilter: string;
  updateTag: string;
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

// Item Definitions
export const ZSearch = z.object({
  tags: z.array(z.string()).catch([]),
  filters: z.array(z.string()).catch([]),
  text: z.string().catch(''),
});
export type ISearch = z.infer<typeof ZSearch>;
