
import type { IListingState } from '@/lib/model/Items';




export const listingInitState: IListingState = {
  message: "",
  drawer: false,
  modal: false,
  detailModal: false,
  newItemModal: false,
  displayId: '',
  searchQuery: '',
  checkedTag: new Set([]),
  checkedCategory: new Set([]),
  fromDate: '',
  toDate: '',
}


export const createListingSlice = (set) => ({
  ...listingInitState,
  setMessage: (message: string) => set(() => ({ message })),
  setDrawer: (drawer: boolean) => set(() => ({ drawer })),
  setModal: (modal: boolean) => set(() => ({ modal })),
  setDetailModal: (detailModal: boolean) => set(() => ({ detailModal })),
  setNewItemModal: (newItemModal: boolean) => set(() => ({ newItemModal })),
  setDisplayId: (displayId: string) => set(() => ({ displayId })),
  setSearchQuery: (searchQuery: string) => set(() => ({ searchQuery })),
  setCheckedCategory: (checkedCategory: Set<string>) => set(() => ({ checkedCategory })),
  setCheckedTag: (checkedTag: Set<string>) => set(() => ({ checkedTag })),
  setFromDate: (fromDate: string) => set(() => ({ fromDate })),
  setToDate: (toDate: string) => set(() => ({ toDate })),
  reset: () => set(() => ({ ...listingInitState })),
});



