
import type {
  IItem,
} from "@/lib/model/item";
import type {
  ITag,
} from "@/lib/model/tag";
import type {
  IFilter,
} from "@/lib/model/filter";

// Home Page Store
export type IHomeState = {
  filterModal: boolean
  tagModal: boolean
  settingModal: boolean
  displayTag: undefined | ITag
  displayFilter: undefined | IFilter
  homeSearchQuery: undefined | string
}
export type IHomeActions = {
  setFilterModal: (filterModal: boolean) => void
  setTagModal: (tagModal: boolean) => void
  setSettingModal: (settingModal: boolean) => void
  setDisplayTag: (displayTag: undefined | ITag) => void
  setDisplayFilter: (displayFilter: undefined | IFilter) => void
  setHomeSearchQuery: (homeSearchQuery: undefined | string) => void
  reset: () => void
}
export type IHomeSlice = IHomeState & IHomeActions;



// Item Store
export type IItemState = {
  message: string
  itemModal: boolean
  displayItem: IItem
  itemSearchQuery: string
  itemTitle: undefined | string,
  itemReference: undefined | ITag | IFilter,
}
export type IItemActions = {
  setMessage: (message: string) => void
  setItemModal: (itemModal: boolean) => void
  setDisplayItem: (displayItem: IItem) => void
  setItemSearchQuery: (itemSearchQuery: string) => void
  setItemTitle: (itemTitle: string) => void
  setItemReference: (itemReference: undefined | ITag | IFilter) => void
  reset: () => void
}
export type IItemSlice = IItemState & IItemActions;




// Tag Store
export type IListingState = {
  message: string
  drawer: boolean
  itemModal: boolean
  filterModal: boolean
  tagModal: boolean
  settingModal: boolean
  selectMode: boolean
  displayItem: IItem
  displayTag: ITag
  displayFilter: IFilter
  searchQuery: string
  checkedTag: Set<string>
  checkedCategory: Set<string>
  fromDate: string
  toDate: string
}
export type IListingActions = {
  setMessage: (message: string) => void
  setDrawer: (drawer: boolean) => void
  setItemModal: (itemModal: boolean) => void
  setFilterModal: (filterModal: boolean) => void
  setTagModal: (tagModal: boolean) => void
  setSettingModal: (settingModal: boolean) => void
  setSelectMode: (selectMode: boolean) => void
  setDisplayItem: (displayItem: IItem) => void
  setDisplayTag: (displayTag: ITag) => void
  setDisplayFilter: (displayFilter: IFilter) => void
  setSearchQuery: (searchQuery: string) => void
  setCheckedTag: (checkedTag: Set<string>) => void
  setCheckedCategory: (checkedCategory: Set<string>) => void
  setFromDate: (fromDate: string) => void
  setToDate: (toDate: string) => void
  reset: () => void
}
export type IListingSlice = IListingState & IListingActions;



// Items Store
export type IDetailState = {
  message: string
  drawer: boolean
  modal: boolean
  displayId: string
  searchQuery: string
  checkedTag: Set<string>
  checkedCategory: Set<string>
  fromDate: string
  toDate: string
}
export type IDetailActions = {
  setMessage: (message: string) => void
  setDrawer: (drawer: boolean) => void
  setModal: (modal: boolean) => void
  setDisplayId: (displayId: string) => void
  setSearchQuery: (searchQuery: string) => void
  setCheckedTag: (checkedTag: Set<string>) => void
  setCheckedCategory: (checkedCategory: Set<string>) => void
  setFromDate: (fromDate: string) => void
  setToDate: (toDate: string) => void
  reset: () => void
}
export type IDetailSlice = IDetailState & IDetailActions;
export type IStore = IHomeSlice & IItemSlice & IDetailSlice & IListingSlice;
