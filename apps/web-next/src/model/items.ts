
export type AuditUpdaterEnum = "AUDIT_UPDATER_ENUM_UNSPECIFIED" | "AUDIT_UPDATER_ENUM_FRONTEND" | "AUDIT_UPDATER_ENUM_SYSOPS";


export interface Audit {
    createdBy: AuditUpdaterEnum
    createdAt: string
    updatedBy: AuditUpdaterEnum
    updatedAt: string
    deletedBy: AuditUpdaterEnum
    deletedAt: string
}


export interface ItemModelInterface {
    id: string
    userId: string
    title: string
    summary: string
    category: string
    description: string
    note: string
    tags: string[]
    properties: {[index: string]: string}
    reactivateAt: string
    audit: Audit
}


export interface ItemStateInterface {
	tagFilters: string[]
	categoryFilters: string[]
	definedFilters: string[]
	editStatus: string
	filterDrawerStatus: boolean
	newTag: string
	selectedItem: null | ItemModelInterface
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
