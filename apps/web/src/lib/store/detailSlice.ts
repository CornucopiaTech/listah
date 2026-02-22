import type { StateCreator } from 'zustand';



import type { IListingState, IDetailSlice, IStore } from '@/lib/model/item';




export const listingInitState: IListingState = {
  message: "",
  drawer: false,
  modal: false,
  displayId: '',
  searchQuery: '',
  checkedTag: new Set<string>([]),
  checkedCategory: new Set<string>([]),
  fromDate: '',
  toDate: '',
}

export const createDetailSlice: StateCreator<
  IStore,
  [['zustand/devtools', never]],
  [],
  IDetailSlice
  > = (set) => ({
    ...listingInitState,
    setMessage: (message: string) => set(() => ({ message })),
    setDrawer: (drawer: boolean) => set(() => ({ drawer })),
    setModal: (modal: boolean) => set(() => ({ modal })),
    setDisplayId: (displayId: string) => set(() => ({ displayId })),
    setSearchQuery: (searchQuery: string) => set(() => ({ searchQuery })),
    setCheckedCategory: (checkedCategory: Set<string>) => set(() => ({ checkedCategory })),
    setCheckedTag: (checkedTag: Set<string>) => set(() => ({ checkedTag })),
    setFromDate: (fromDate: string) => set(() => ({ fromDate })),
    setToDate: (toDate: string) => set(() => ({ toDate })),
    reset: () => set(listingInitState),
  });
