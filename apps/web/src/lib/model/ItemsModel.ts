
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
  tags: string[] | null;
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
  totalRecordCount: number;
  pagination: Pagination;
}


// Item Store
export interface StateItems {
  itemsPerPage: number; //records per page
  currentPage: number; //current page
  categoryFilter: string | string[];
  tagFilter: string[];
  modalOpen: boolean;
}

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
  updateTags: (tags: string[]) => void;
  updateSoftDelete: (softDelete: boolean) => void;
  updateProperties: (properties: { [index: string]: string }) => void;
  updateReactivateAt: (reactivateAt: string) => void;
  updateNewTag: (newTag: string) => void;
}

export interface UpdateItemStore extends UpdateItemState, UpdateItemActions;



// Items Store
export interface ItemsState {
  itemsPerPage?: number; //records per page
  currentPage?: number;//current page
  categoryFilter?: string[];
  tagFilter?: string[];
  modalOpen?: boolean;
  inEditMode?: boolean;
}

export interface ItemsActions {
  updateItemsPageRecordCount: (recordCount: number) => void
  updateItemsCurrentPage: (currentPage: number) => void
  updateItemsCategoryFilter: (category: string ) => void
  updateItemsTagFilter: (tag: string) => void
  updateModal: (modalOpen: boolean) => void
  updateEditMode: (inEditMode: boolean) => void
}

export interface ItemsStore extends ItemsState, ItemsActions;
