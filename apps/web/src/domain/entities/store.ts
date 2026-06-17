
import type {
  IItem,
} from "@/domain/entities/item";
import type {
  ITag,
} from "@/domain/entities/tag";
import type {
  IFilter,
} from "@/domain/entities/filter";



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
  tagScroll: number
}
export type ITagActions = {
  setTagModal: (tagModal: boolean) => void
  setDisplayTag: (displayTag: undefined | ITag) => void
  setTagScroll: (tagScroll: number) => void
  reset: () => void
}
export type ITagSlice = ITagState & ITagActions;


// Filter Page Store
export type IFilterState = {
  filterModal: boolean
  displayFilter: undefined | IFilter
  filterScroll: number
}
export type IFilterActions = {
  setFilterModal: (filterModal: boolean) => void
  setDisplayFilter: (displayFilter: undefined | IFilter) => void
  setFilterScroll: (filterScroll: number) => void
  reset: () => void
}
export type IFilterSlice = IFilterState & IFilterActions;



// Item Store
export type IItemState = {
  message: string
  itemModal: boolean
  displayItem: IItem
  itemSearchQuery: string
  itemTitle: undefined | string
  itemReference: undefined | ITag | IFilter
  itemScroll: number
}
export type IItemActions = {
  setMessage: (message: string) => void
  setItemModal: (itemModal: boolean) => void
  setDisplayItem: (displayItem: IItem) => void
  setItemSearchQuery: (itemSearchQuery: string) => void
  setItemTitle: (itemTitle: string) => void
  setItemReference: (itemReference: undefined | ITag | IFilter) => void
  setItemScroll: (itemScroll: number) => void
  reset: () => void
}
export type IItemSlice = IItemState & IItemActions;



export type IStore = ILayoutSlice & ITagSlice & IFilterSlice & IItemSlice;
