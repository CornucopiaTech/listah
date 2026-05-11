
import type {
  IItem,
} from "@/lib/model/item";
import type {
  ITag,
} from "@/lib/model/tag";
import type {
  IFilter,
} from "@/lib/model/filter";



// Common Layout Store
export type ILayoutState = {
  drawerOpen: boolean
  searchQuery: undefined | string
}
export type ILayoutActions = {
  toggleDrawer: (drawerOpen: boolean) => void
  setSearchQuery: (searchQuery: undefined | string) => void
  reset: () => void
}
export type ILayoutSlice = ILayoutState & ILayoutActions;


// Tag Page Store
export type ITagState = {
  tagModal: boolean
  displayTag: undefined | ITag
}
export type ITagActions = {
  setTagModal: (tagModal: boolean) => void
  setDisplayTag: (displayTag: undefined | ITag) => void
  reset: () => void
}
export type ITagSlice = ITagState & ITagActions;


// Filter Page Store
export type IFilterState = {
  filterModal: boolean
  displayFilter: undefined | IFilter
}
export type IFilterActions = {
  setFilterModal: (filterModal: boolean) => void
  setDisplayFilter: (displayFilter: undefined | IFilter) => void
  reset: () => void
}
export type IFilterSlice = IFilterState & IFilterActions;



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



export type IStore = ILayoutSlice & ITagSlice & IFilterSlice & IItemSlice;
