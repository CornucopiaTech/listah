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
  checkedTag: new Set([]),
  checkedCategory: new Set([]),
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
    updateItemsCheckedCategory: (checkedCategory: Set<string>) => set((state) => ({ checkedCategory })),
    updateItemsCheckedTag: (checkedTag: Set<string>) => set((state) => ({ checkedTag })),
    updateItemsFromDate: (readFromDate: string) => set((state) => ({ readFromDate })),
    updateItemsToDate: (readToDate: string) => set((state) => ({ readToDate })),
    updateFilterFromDate: (filterFromDate: string) => set((state) => ({ filterFromDate })),
    updateFilterToDate: (filterToDate: string) => set((state) => ({ filterToDate })),

  }))
}
