import { create } from 'zustand';
import type { ItemsState } from '@/lib/model/ItemsModel';



export const defaultPagesInitState: ItemsState = {
  itemsPerPage: 20,
  currentPage: 1,
  categoryFilter: [],
  tagFilter: [],
  readFromDate: "",
  readToDate: "",
  drawerOpen: false,
  searchQuery: '',
  checkedTagList: [],
  checkedCategoryList: [],
  checkedTag: new Set([]),
  checkedCategory: new Set([]),
  filterFromDate: '',
  filterToDate: '',
}


export const useItemsStore = create((set) => ({
  ...defaultPagesInitState,
  updateItemsPageRecordCount: (recordCount: number) => set(() => ({ itemsPerPage: recordCount })),
  updateItemsCurrentPage: (currentPage: number) => set(() => ({ currentPage })),
  updateItemsCategoryFilter: (categoryFilter: string[]) => set(
    (state) => ({ categoryFilter })
  ),
  updateItemsTagFilter: (tagFilter: string[]) => set((state) => ({ tagFilter })),
  toggleDrawer: (drawerOpen: boolean) => set(() => ({ drawerOpen })),
  updateSearchQuery: (searchQuery: string) => set(() => ({ searchQuery })),
  updateItemsCheckedCategory: (checkedCategory: Set<string>) => set((state) => ({ checkedCategory })),
  updateItemsCheckedTag: (checkedTag: Set<string>) => set((state) => ({ checkedTag })),
  updateItemsCheckedCategoryList: (checkedCategoryList: Set<string>) => set((state) => ({ checkedCategoryList })),
  updateItemsCheckedTagList: (checkedTagList: Set<string>) => set((state) => ({ checkedTagList })),
  updateItemsFromDate: (readFromDate: string) => set((state) => ({ readFromDate })),
  updateItemsToDate: (readToDate: string) => set((state) => ({ readToDate })),
  updateFilterFromDate: (filterFromDate: string) => set((state) => ({ filterFromDate })),
  updateFilterToDate: (filterToDate: string) => set((state) => ({ filterToDate })),
}))
