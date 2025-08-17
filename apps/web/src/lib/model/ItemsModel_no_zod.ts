

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


// Update Item Store
export interface UpdateItemState {
  item: ItemProto
  newTag: string | null,
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

export interface UpdateItemStore extends UpdateItemState, UpdateItemActions{};



// Items Store
export interface ItemsState {
  itemsPerPage?: number; //records per page
  currentPage?: number;//current page
  categoryFilter?: string[];
  tagFilter?: string[];
  readFromDate?: string;
  readToDate?: string;
  drawerOpen?: boolean;
  searchQuery?: string;
  checkedTag?: Set<string>;
  checkedCategory?: Set<string>;
  filterFromDate: string;
  filterToDate: string;
}

export interface ItemsActions {
  updateItemsPageRecordCount: (recordCount: number) => void
  updateItemsCurrentPage: (currentPage: number) => void
  updateItemsCategoryFilter: (categoryFilter: string[] ) => void
  updateItemsTagFilter: (tagFilter: string[]) => void
  toggleDrawer: (drawerOpen: boolean) => void
  updateSearchQuery: (searchQuery: string) => void
  updateItemsCheckedCategory: (checkedCategory: Set<string>) => void
  updateItemsCheckedTag: (checkedTag: Set<string>) => void
  updateItemsFromDate: (readFromDate: string) => void
  updateItemsToDate: (readToDate: string) => void
  updateFilterFromDate: (filterFromDate: string) => void
  updateFilterToDate: (filterToDate: string) => void
}

export interface ItemsStore extends ItemsState, ItemsActions;
