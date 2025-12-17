import * as z from "zod";

export type AuditUpdaterEnum = "AUDIT_UPDATER_ENUM_UNSPECIFIED" | "AUDIT_UPDATER_ENUM_FRONTEND" | "AUDIT_UPDATER_ENUM_SYSOPS";

const auditEnum = [
  "AUDIT_UPDATER_ENUM_UNSPECIFIED",
  "AUDIT_UPDATER_ENUM_FRONTEND",
  "AUDIT_UPDATER_ENUM_SYSOPS"
]

export const ZTraceBaggage = z.object({
  traceparent: z.nullish(z.string()),
  tracestate: z.nullish(z.string()),
  b3: z.nullish(z.string()),
});
export interface TraceBaggage extends z.infer<typeof ZTraceBaggage>{};


export const ZAudit = z.object({
  createdBy: z.enum(auditEnum),
  createdAt: z.nullish(z.iso.datetime()),
  updatedBy: z.enum(auditEnum),
  updatedAt: z.nullish(z.iso.datetime()),
  deletedBy: z.enum(auditEnum),
  deletedAt: z.nullish(z.iso.datetime()),
});
export interface Audit extends z.infer<typeof ZAudit>{};



export const ZItemProto = z.object({
  id: z.nullish(z.uuid()),
  userId: z.nullish(z.uuid()),
  summary: z.nullish(z.string()),
  category: z.nullish(z.string()),
  description: z.nullish(z.string()),
  note: z.nullish(z.string()),
  tag: z.nullish(z.array(z.string())),
  softDelete: z.nullish(z.boolean()),
  properties: z.nullish(z.unknown()),
  reactivateAt: z.nullish(z.string()),
  audit: z.nullish(ZAudit),
});
export interface ItemProto extends z.infer<typeof ZItemProto>{};


export const ZPagination = z.object({
  pageNumber: z.number(),
  recordsPerPage: z.number(),
  sortCondition: z.nullish(z.any()),
});
export interface Pagination extends z.infer<typeof ZPagination>{};



export const ZItemsProto = z.object({
  items: z.array(ZItemProto),
  totalRecordCount: z.nullish(z.number()),
  pagination: z.nullish(ZPagination),
  tag: z.nullish(z.array(z.string())),
  category: z.nullish(z.array(z.string())),
});
export interface ItemsProto extends z.infer<typeof ZItemsProto>{};



// Items Store
export interface IListingState {
  itemsPerPage: number; //records per page
  currentPage: number;//current page
  categoryFilter: string[];
  tagFilter: string[];
  drawerOpen: boolean;
  searchQuery: string;
  checkedTag: Set<string>;
  checkedCategory: Set<string>;
  fromFilterDate: string;
  toFilterDate: string;
}




// Update Item Store
export interface IDetailState {
  item: ItemProto;
  newTag: string | null;
}
