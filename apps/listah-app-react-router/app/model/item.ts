
export type AuditUpdaterEnum = "AUDIT_UPDATER_ENUM_UNSPECIFIED" | "AUDIT_UPDATER_ENUM_FRONTEND" | "AUDIT_UPDATER_ENUM_SYSOPS";


export type Audit = {
    createdBy: AuditUpdaterEnum;
    createdAt: string;
    updatedBy: AuditUpdaterEnum;
    updatedAt: string;
    deletedBy: AuditUpdaterEnum;
    deletedAt: string;
}



export type ItemModel = {
    id: string;
    userId: string;
    title: string;
    category: string;
    description: string;
    note: string;
    tags: string[];
    properties: {[index: string]: string};
    reactivateAt: string;
    audit: Audit;
}


export type ItemResponseModel = {
    id: string;
    userId: string;
    title: string;
    description: string;
    note: string;
    tags: string[];
    properties: {[index: string]: string};
    reactivateAt: string;
    audit: Audit;
}


export type ItemsResponseModel = {
    items: ItemResponseModel [];
}


export type ItemRequestModel = {
    filters: string[];

}
