


import type { IListingState } from '@/lib/model/Items';




export const listingInitState: IListingState = {
  message: "",
  drawer: false,
  modal: false,
  itemModal: false,
  categoryModal: false,
  tagModal: false,
  displayId: '',
  searchQuery: '',
  checkedTag: new Set<string>([]),
  checkedCategory: new Set<string>([]),
  fromDate: '',
  toDate: '',
}


export const createListingSlice = (set: any) => ({
  ...listingInitState,
  setMessage: (message: string) => set(() => ({ message })),
  setDrawer: (drawer: boolean) => set(() => ({ drawer })),
  setModal: (modal: boolean) => set(() => ({ modal })),
  setItemModal: (itemModal: boolean) => set(() => ({ itemModal })),
  setTagModal: (tagModal: boolean) => set(() => ({ tagModal })),
  setCategoryModal: (categoryModal: boolean) => set(() => ({ categoryModal })),
  setDisplayId: (displayId: string) => set(() => ({ displayId })),
  setSearchQuery: (searchQuery: string) => set(() => ({ searchQuery })),
  setCheckedCategory: (checkedCategory: Set<string>) => set(() => ({ checkedCategory })),
  setCheckedTag: (checkedTag: Set<string>) => set(() => ({ checkedTag })),
  setFromDate: (fromDate: string) => set(() => ({ fromDate })),
  setToDate: (toDate: string) => set(() => ({ toDate })),
  reset: () => set(() => ({ ...listingInitState })),
});




