
import type { ItemsState, ItemsStore, } from '@/lib/model/ItemsModel';
import { devtools } from 'zustand/middleware';




export const itemsInitState: ItemsState = {
  itemsPerPage: 50,
  currentPage: 1,
  categoryFilter: [],
  tagFilter: [],
  drawerOpen: false,
  searchQuery: '',
  checkedTag: new Set([]),
  checkedCategory: new Set([]),
  fromFilterDate: '',
  toFilterDate: '',
}


export const createItemsSlice = devtools((set) => ({
    ...itemsInitState,
    updateItemsPageRecordCount: (itemsPerPage: number) => set(() => ({ itemsPerPage })),
    updateItemsCurrentPage: (currentPage: number) => set(() => ({ currentPage })),
    updateItemsCategoryFilter: (categoryFilter: string[]) => set(() => ({ categoryFilter })),
    updateItemsTagFilter: (tagFilter: string[]) => set(() => ({ tagFilter })),
    toggleDrawer: (drawerOpen: boolean) => set(() => ({ drawerOpen })),
    updateSearchQuery: (searchQuery: string) => set(() => ({ searchQuery })),
    updateItemsCheckedCategory: (checkedCategory: Set<string>) => set(() => ({ checkedCategory })),
    updateItemsCheckedTag: (checkedTag: Set<string>) => set(() => ({ checkedTag })),
    updateFromFilterDate: (fromFilterDate: string) => set(() => ({ fromFilterDate })),
    updateToFilterDate: (toFilterDate: string) => set(() => ({ toFilterDate })),
    reset: () => set(() => ({ ...itemsInitState })),
  })
);



