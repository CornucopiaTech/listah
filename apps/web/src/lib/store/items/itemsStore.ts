import { createStore } from 'zustand/vanilla';
import { ItemsState, ItemsStore, } from '@/lib/model/ItemsModel';



export const defaultPagesInitState: ItemsState = {
  itemsPerPage: 20,
  currentPage: 1,
  categoryFilter: [],
  tagFilter: [],
  readFromDate: "",
  readToDate: "",
  drawerOpen: false,
  searchQuery: '',
  collapseTags: true,
  collapseCategories: true,
  collapseDatePicker: true,
  checkedTags: [],
  checkedCategories: [],
  filterFromDate: '',
  filterToDate: '',
}
export const createItemsStore = (
  initState: ItemsState = defaultPagesInitState,
) => {
  return createStore<ItemsStore>()((set) => ({
    ...initState,
    updateItemsPageRecordCount: (recordCount: number) => set(() => ({ itemsPerPage: recordCount})),
    updateItemsCurrentPage: (currentPage: number) => set(() => ({ currentPage })),
    updateItemsCategoryFilter: (categoryFilter: string[]) => set(
      (state) => ({ categoryFilter })
    ),
    updateItemsTagFilter: (tagFilter: string[]) => set((state) => ({ tagFilter })),
    toggleDrawer: (drawerOpen: boolean) => set(() => ({ drawerOpen })),
    updateSearchQuery: (searchQuery: string) => set(() => ({ searchQuery })),
    toggleCollapseTags: (collapseTags: boolean) => set(() => ({ collapseTags })),
    toggleCollapseCategories: (collapseCategories: boolean) => set(() => ({ collapseCategories })),
    toggleCollapseDatePicker: (collapseDatePicker: boolean) => set(() => ({ collapseDatePicker })),
    updateItemsCheckedCategory: (checkedCategories: string[]) => set((state) => ({ checkedCategories })),
    updateItemsCheckedTags: (checkedTags: string[]) => set((state) => ({ checkedTags })),
    updateItemsFromDate: (readFromDate: string) => set((state) => ({ readFromDate })),
    updateItemsToDate: (readToDate: string) => set((state) => ({ readToDate })),
    updateFilterFromDate: (filterFromDate: string) => set((state) => ({ filterFromDate })),
    updateFilterToDate: (filterToDate: string) => set((state) => ({ filterToDate })),

  }))
}
