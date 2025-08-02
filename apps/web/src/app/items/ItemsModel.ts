
export type AuditUpdaterEnum = "AUDIT_UPDATER_ENUM_UNSPECIFIED" | "AUDIT_UPDATER_ENUM_FRONTEND" | "AUDIT_UPDATER_ENUM_SYSOPS";


export interface ITraceBaggage {
  traceparent?: string;
  tracestate?: string;
  b3?: string;
}


export interface Audit {
    createdBy: AuditUpdaterEnum
    createdAt: string
    updatedBy: AuditUpdaterEnum
    updatedAt: string
    deletedBy: AuditUpdaterEnum
    deletedAt: string
}
export interface IProtoItem {
  id: string
  userId: string
  title: string
  summary: string
  category: string
  description: string
  note: string
  tags: string[]
  soft_delete: boolean,
  properties: { [index: string]: string }
  reactivateAt: string
  audit: Audit
}


export interface Pagination {
  pageNumber: number,
  recordsPerPage: number,
  sortCondition: Map<string, string>,
}

export interface IProtoItems {
  items: IProtoItem[],
  totalRecordCount: number,
  pagination: Pagination,
}


export interface ItemsStateInterface {
  pageRecordCount: number, //records per page
  currentPage: number, //current page
  categoryFilter: string | string[],
  tagFilter: string[],
  modalOpen: boolean,

}

export interface ItemsAppStateInterface {
  page: number,
  payload: IProtoItems,
  tagFilters: string[]
  categoryFilters: string[]
  definedFilters: string[]
  editStatus: string
  filterDrawerStatus: boolean
  newTag: string
  selectedItem: null | IProtoItem
  tagCollapsed: boolean
}


export interface ItemStateReduxInterface {
	value: ItemStateInterface
}

export interface TagChangePayloadInterface {
	previous: null | string
	current: null | string
}

export interface AttributeChangePayloadInterface {
	itemAttribute: null | string
	attributeValue: null | string
}

export interface FilterChangePayloadInterface {
	filterName: string
	filterChecked: string
}
