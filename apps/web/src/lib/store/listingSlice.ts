
import type { IListingState } from '@/lib/model/Items';




export const listingInitState: IListingState = {
  drawer: false,
  modal: false,
  displayId: '',
  searchQuery: '',
  checkedTag: new Set([]),
  checkedCategory: new Set([]),
  fromDate: '',
  toDate: '',
}


export const createListingSlice = (set) => ({
  ...listingInitState,
  setDrawer: (drawer: boolean) => set(() => ({ drawer })),
  setModal: (modal: boolean) => set(() => ({ modal })),
  setDisplayId: (displayId: string) => set(() => ({ displayId })),
  setSearchQuery: (searchQuery: string) => set(() => ({ searchQuery })),
  setCheckedCategory: (checkedCategory: Set<string>) => set(() => ({ checkedCategory })),
  setCheckedTag: (checkedTag: Set<string>) => set(() => ({ checkedTag })),
  setFromDate: (fromDate: string) => set(() => ({ fromDate })),
  setToDate: (toDate: string) => set(() => ({ toDate })),
  reset: () => set(() => ({ ...listingInitState })),
});



