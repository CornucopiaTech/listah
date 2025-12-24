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
  createdBy: z.nullish(z.enum(auditEnum)),
  createdAt: z.nullish(z.iso.datetime()),
  updatedBy: z.nullish(z.enum(auditEnum)),
  updatedAt: z.nullish(z.iso.datetime()),
  deletedBy: z.nullish(z.enum(auditEnum)),
  deletedAt: z.nullish(z.iso.datetime()),
});
export interface Audit extends z.infer<typeof ZAudit>{};



export const ItemProtoSchema = z.object({
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
export interface ItemProto extends z.infer<typeof ItemProtoSchema>{};



export const ItemsProtoSchema = z.object({
  items: z.array(ItemProtoSchema).catch([]),
  userId: z.string().catch(''),
  category: z.array(z.string()).catch([]),
  tag: z.array(z.string()).catch([]),


  pageSize: z.number().catch(10),
  page: z.number().catch(1),
  sort: z.string().catch('asc'),

  categoryFilter: z.array(z.string()).catch([]),
  tagFilter: z.array(z.string()).catch([]),
  searchQuery: z.string().catch(''),
  fromDate: z.string().catch('1970-01-01'),
  toDate: z.string().catch('2099-12-31'),
});
export interface ItemsProto extends z.infer<typeof ItemsProtoSchema>{};



// Items Store
export interface IListingState {
  drawer: boolean;
  searchQuery: string;
  checkedTag: Set<string>;
  checkedCategory: Set<string>;
  fromDate: string;
  toDate: string;
}


export interface IListingActions {
  setDrawer: (drawer: boolean) => void
  setSearchQuery: (searchQuery: string) => void
  setCheckedTag: (checkedTag: Set<string>) => void
  setCheckedCategory: (checkedCategory: Set<string>) => void
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






export const ItemsSearchSchema = z.object({
  tagFilter: z.array(z.string()).catch([]),
  categoryFilter: z.array(z.string()).catch([]),
  searchQuery: z.string().catch(''),
  fromDate: z.string().catch('1970-01-01'),
  toDate: z.string().catch('2099-12-31'),
  pageSize: z.number().catch(50),
  pageNumber: z.number().catch(1),
  sortQuery: z.string().catch(''),
})

export interface IItemsSearch extends z.infer<typeof ItemsSearchSchema>{}
