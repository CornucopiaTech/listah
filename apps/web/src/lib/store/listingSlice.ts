
import type { IListingState } from '@/lib/model/ItemsModel';




export const listingInitState: IListingState = {
  drawer: false,
  searchQuery: '',
  checkedTag: new Set([]),
  checkedCategory: new Set([]),
  fromDate: '',
  toDate: '',
}


export const createListingSlice = (set) => ({
  ...listingInitState,
  setDrawer: (drawer: boolean) => set(() => ({ drawer })),
  setSearchQuery: (searchQuery: string) => set(() => ({ searchQuery })),
  setCheckedCategory: (checkedCategory: Set<string>) => set(() => ({ checkedCategory })),
  setCheckedTag: (checkedTag: Set<string>) => set(() => ({ checkedTag })),
  setFromDate: (fromDate: string) => set(() => ({ fromDate })),
  setToDate: (toDate: string) => set(() => ({ toDate })),
  reset: () => set(() => ({ ...listingInitState })),
});



