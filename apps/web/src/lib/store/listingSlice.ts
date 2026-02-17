import type { StateCreator } from 'zustand';



import type { IListingState, IListingSlice, IStore, IItem } from '@/lib/model/Items';
import { DEFAULT_ITEM } from '../helper/defaults';




export const listingInitState: IListingState = {
  message: "",
  drawer: false,
  modal: false,
  displayId: '',
  displayItem: DEFAULT_ITEM,
  searchQuery: '',
  checkedTag: new Set<string>([]),
  checkedCategory: new Set<string>([]),
  fromDate: '',
  toDate: '',
}

export const createListingSlice: StateCreator<
  IStore,
  [['zustand/devtools', never]],
  [],
  IListingSlice
  > = (set) => ({
    ...listingInitState,
    setMessage: (message: string) => set(() => ({ message })),
    setDrawer: (drawer: boolean) => set(() => ({ drawer })),
    setModal: (modal: boolean) => set(() => ({ modal })),
    setDisplayId: (displayId: string) => set(() => ({ displayId })),
    setDisplayItem: (displayItem: IItem) => set(() => ({ displayItem })),
    setSearchQuery: (searchQuery: string) => set(() => ({ searchQuery })),
    setCheckedCategory: (checkedCategory: Set<string>) => set(() => ({ checkedCategory })),
    setCheckedTag: (checkedTag: Set<string>) => set(() => ({ checkedTag })),
    setFromDate: (fromDate: string) => set(() => ({ fromDate })),
    setToDate: (toDate: string) => set(() => ({ toDate })),
    reset: () => set(listingInitState),
  });


