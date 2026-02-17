
import * as z from "zod";

export interface IEnvConfig {
  apiUrl: string;
  authKey: string;
}

export interface IApiEndpointConfig {
  readItem: string;
  updateItem: string;
  readCategory: string;
  readTag: string;
}


export type AuditUpdaterEnum = "AUDIT_UPDATER_ENUM_UNSPECIFIED" | "AUDIT_UPDATER_ENUM_FRONTEND" | "AUDIT_UPDATER_ENUM_SYSOPS";


export const ZPagination = z.object({
  pageNumber: z.number().catch(1),
  recordsPerPage: z.number().catch(10),
  sortCondition: z.string().catch(''),
});
export type IPagination = z.infer<typeof ZPagination>; // eslint-disable-line @typescript-eslint/no-empty-object-type



export interface TraceBaggage {
  traceparent?: string;
  tracestate?: string;
  b3?: string;
}


export interface Audit {
  createdBy: AuditUpdaterEnum;
  createdAt: string;
  updatedBy: AuditUpdaterEnum;
  updatedAt: string;
  deletedBy: AuditUpdaterEnum;
  deletedAt: string;
}

export interface CategoryGroup {
  title: string;
  numberOfItems: number;
}
