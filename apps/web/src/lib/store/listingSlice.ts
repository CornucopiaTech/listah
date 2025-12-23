
import type { IListingState, IDetailState,  } from '@/lib/model/ItemsModel';
import { devtools } from 'zustand/middleware';




export const listingInitState: IListingState = {
  itemsPerPage: 50,
  currentPage: 1,
  categoryFilter: [],
  tagFilter: [],
  drawer: false,
  searchQuery: '',
  checkedTag: new Set([]),
  checkedCategory: new Set([]),
  fromFilterDate: '',
  toFilterDate: '',
}


export const createListingSlice = (set) => ({
  ...listingInitState,
  setItemsPerPage: (itemsPerPage: number) => set(() => ({ itemsPerPage })),
  setCurrentPage: (currentPage: number) => set(() => ({ currentPage })),
  setCategoryFilter: (categoryFilter: string[]) => set(() => ({ categoryFilter })),
  setTagFilter: (tagFilter: string[]) => set(() => ({ tagFilter })),
  setDrawer: (drawer: boolean) => set(() => ({ drawer })),
  setSearchQuery: (searchQuery: string) => set(() => ({ searchQuery })),
  setCheckedCategory: (checkedCategory: Set<string>) => set(() => ({ checkedCategory })),
  setCheckedTag: (checkedTag: Set<string>) => set(() => ({ checkedTag })),
  setFromFilterDate: (fromFilterDate: string) => set(() => ({ fromFilterDate })),
  setToFilterDate: (toFilterDate: string) => set(() => ({ toFilterDate })),
  reset: () => set(() => ({ ...listingInitState })),
});



