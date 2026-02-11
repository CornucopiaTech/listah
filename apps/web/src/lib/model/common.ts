
import * as z from "zod";
// import type { Theme, ThemeOptions } from '@mui/material/styles';


export interface IEnvConfig {
  apiVersion: string;
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


// export interface Pagination {
//   pageNumber: number;
//   recordsPerPage: number;
//   sortCondition: Map<string, string> | null;
// }


export const ZPagination = z.object({
  pageNumber: z.number().catch(1),
  recordsPerPage: z.number().catch(10),
  sortCondition: z.string().catch(''),
});
export interface IPagination extends z.infer<typeof ZPagination>{ }; // eslint-disable-line @typescript-eslint/no-empty-object-type



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

// export interface IItem{
//   id: string | null;
//   userId: string | null;
//   summary: string | null;
//   category: string | null;
//   description: string | null;
//   note: string | null;
//   tag: string[] | null;
//   softDelete: boolean | null;
//   properties: { [index: string]: string } | null;
//   reactivateAt: string | null;
//   audit?: Audit | null;
// }

// export interface Pagination {
//   pageNumber: number;
//   recordsPerPage: number;
//   sortCondition: Map<string, string> | null;
// }

// export interface ZItems {
//   items: IItem;
//   tag: string[];
//   categories: string[];
//   totalRecordCount: number;
//   pagination: Pagination;
// }

