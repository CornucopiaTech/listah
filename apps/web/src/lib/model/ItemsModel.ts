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
export interface IItemsProto extends z.infer<typeof ZItemsProto>{};



// Items Store
export interface IListingState {
  itemsPerPage: number; //records per page
  currentPage: number;//current page
  categoryFilter: string[];
  tagFilter: string[];
  drawer: boolean;
  searchQuery: string;
  checkedTag: Set<string>;
  checkedCategory: Set<string>;
  fromFilterDate: string;
  toFilterDate: string;
}


export interface IListingActions {
  setItemsPerPage: (recordCount: number) => void
  setCurrentPage: (currentPage: number) => void
  setCategoryFilter: (categoryFilter: string[]) => void
  setTagFilter: (tagFilter: string[]) => void
  setDrawer: (drawer: boolean) => void
  setSearchQuery: (searchQuery: string) => void
  setCheckedTag: (checkedTag: Set<string>) => void
  setCheckedCategory: (checkedCategory: Set<string>) => void
  setFromFilterDate: (filterFromDate: string) => void
  setToFilterDate: (filterToDate: string) => void
}
export interface IListingStore extends IListingState, IListingActions { };




export interface IDetailActions {
  setState: (item: ItemProto) => void;
  setSummary: (summary: string) => void;
  setCategory: (category: string) => void;
  setDescription: (description: string) => void;
  setNote: (note: string) => void;
  setTags: (tag: string[]) => void;
  setSoftDelete: (softDelete: boolean) => void;
  setProperties: (properties: { [index: string]: string }) => void;
  setReactivateAt: (reactivateAt: string) => void;
  setNewTag: (newTag: string) => void;
}



// Update Item Store
export interface IDetailState {
  item: ItemProto;
  newTag: string | null;
}
export interface IDetailStore extends IDetailState, IDetailActions { };
