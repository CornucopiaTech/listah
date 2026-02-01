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
export interface ITraceBaggage extends z.infer<typeof ZTraceBaggage>{ }; // eslint-disable-line @typescript-eslint/no-empty-object-type


export const ZAudit = z.object({
  createdBy: z.nullish(z.enum(auditEnum)),
  createdAt: z.nullish(z.iso.datetime()),
  updatedBy: z.nullish(z.enum(auditEnum)),
  updatedAt: z.nullish(z.iso.datetime()),
  deletedBy: z.nullish(z.enum(auditEnum)),
  deletedAt: z.nullish(z.iso.datetime()),
});
export interface IAudit extends z.infer<typeof ZAudit>{ }; // eslint-disable-line @typescript-eslint/no-empty-object-type



export const ZItem = z.object({
  id: z.nullish(z.string()),
  userId: z.nullish(z.string()),
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
export interface IItem extends z.infer<typeof ZItem>{ }; // eslint-disable-line @typescript-eslint/no-empty-object-type



export const ZItemRequest = z.object({
  items: z.array(ZItem).catch([]),
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
export interface IItemRequest extends z.infer<typeof ZItemRequest>{ }; // eslint-disable-line @typescript-eslint/no-empty-object-type


export const ZItemResponse = z.object({
  items: z.array(ZItem).catch([]),
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
export interface IItemResponse extends z.infer<typeof ZItemResponse>{ }; // eslint-disable-line @typescript-eslint/no-empty-object-type



// Items Store
export interface IListingState {
  message: string;
  drawer: boolean;
  modal: boolean;
  itemModal: boolean;
  categoryModal: boolean;
  tagModal: boolean;
  displayId: string;
  searchQuery: string;
  checkedTag: Set<string>;
  checkedCategory: Set<string>;
  fromDate: string;
  toDate: string;
}


export interface IListingActions {
  setMessage: (message: string) => void
  setDrawer: (drawer: boolean) => void
  setModal: (modal: boolean) => void
  setDetailModal: (detailModal: boolean) => void
  setNewItemModal: (newItemModal: boolean) => void
  setSearchQuery: (searchQuery: string) => void
  setCheckedTag: (checkedTag: Set<string>) => void
  setCheckedCategory: (checkedCategory: Set<string>) => void
  setFromDate: (fromDate: string) => void
  setToDate: (toDate: string) => void
  reset: () => void
}
export interface IListingStore extends IListingState, IListingActions { };




export const ZItemsSearch = z.object({
  userId: z.nullish(z.uuid()),
  tagFilter: z.array(z.string()).catch([]),
  categoryFilter: z.array(z.string()).catch([]),
  searchQuery: z.string().catch(''),
  fromDate: z.string().catch('1970-01-01'),
  toDate: z.string().catch('2099-12-31'),
  pageSize: z.number().catch(50),
  pageNumber: z.number().catch(1),
  sortQuery: z.string().catch(''),
})


export interface IItemsSearch extends z.infer<typeof ZItemsSearch>{ }; // eslint-disable-line @typescript-eslint/no-empty-object-type
