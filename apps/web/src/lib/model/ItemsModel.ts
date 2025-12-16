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
export interface ItemsState {
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

// export interface ItemsState {
//   itemsPerPage?: number; //records per page
//   currentPage?: number;//current page
//   categoryFilter?: string[];
//   tagFilter?: string[];
//   readFromDate?: string;
//   readToDate?: string;
//   drawerOpen?: boolean;
//   searchQuery?: string;
//   checkedTag?: Set<string>;
//   checkedCategory?: Set<string>;
//   filterFromDate: string;
//   filterToDate: string;
// }

export interface ItemsActions {
  updateItemsPageRecordCount: (recordCount: number) => void;
  updateItemsCurrentPage: (currentPage: number) => void;
  updateItemsCategoryFilter: (categoryFilter: string[] ) => void;
  updateItemsTagFilter: (tagFilter: string[]) => void;
  toggleDrawer: (drawerOpen: boolean) => void;
  updateSearchQuery: (searchQuery: string) => void;
  updateItemsCheckedCategory: (checkedCategory: Set<string>) => void;
  updateItemsCheckedTag: (checkedTag: Set<string>) => void;
  updateItemsFromDate: (readFromDate: string) => void;
  updateItemsToDate: (readToDate: string) => void;
  updateFilterFromDate: (filterFromDate: string) => void;
  updateFilterToDate: (filterToDate: string) => void;
}

export interface ItemsStore extends ItemsState, ItemsActions{};
// export type ItemsStore = ItemsState & ItemsActions;



// Update Item Store
export interface UpdateItemState {
  item: ItemProto;
  newTag: string | null;
}

export interface UpdateItemActions {
  setState: (item: ItemProto) => void;
  updateSummary: (summary: string) => void;
  updateCategory: (category: string) => void;
  updateDescription: (description: string) => void;
  updateNote: (note: string) => void;
  updateTags: (tag: string[]) => void;
  updateSoftDelete: (softDelete: boolean) => void;
  updateProperties: (properties: { [index: string]: string }) => void;
  updateReactivateAt: (reactivateAt: string) => void;
  updateNewTag: (newTag: string) => void;
}

export interface UpdateItemStore extends UpdateItemState, UpdateItemActions { };

