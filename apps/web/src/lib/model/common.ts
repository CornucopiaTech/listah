
export type AuditUpdaterEnum = "AUDIT_UPDATER_ENUM_UNSPECIFIED" | "AUDIT_UPDATER_ENUM_FRONTEND" | "AUDIT_UPDATER_ENUM_SYSOPS";


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

export interface ItemProto{
  id: string | null;
  userId: string | null;
  summary: string | null;
  category: string | null;
  description: string | null;
  note: string | null;
  tag: string[] | null;
  softDelete: boolean | null;
  properties: { [index: string]: string } | null;
  reactivateAt: string | null;
  audit?: Audit | null;
}

export interface Pagination {
  pageNumber: number;
  recordsPerPage: number;
  sortCondition: Map<string, string> | null;
}

export interface ItemsProto {
  items: ItemProto;
  tag: string[];
  categories: string[];
  totalRecordCount: number;
  pagination: Pagination;
}
