import type { StateCreator } from 'zustand';



import type {  IItem } from '@/lib/model/item';
import type {
  IListingState,
   IListingSlice,
   IStore,
} from '@/lib/model/store';
import { DEFAULT_ITEM } from '../helper/defaults';




export const listingInitState: IListingState = {
  message: "",
  drawer: false,
  itemModal: false,
  filterModal: false,
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
    setItemModal: (itemModal: boolean) => set(() => ({ itemModal })),
    setFilterModal: (filterModal: boolean) => set(() => ({ filterModal })),
    setDisplayId: (displayId: string) => set(() => ({ displayId })),
    setDisplayItem: (displayItem: IItem) => set(() => ({ displayItem })),
    setSearchQuery: (searchQuery: string) => set(() => ({ searchQuery })),
    setCheckedCategory: (checkedCategory: Set<string>) => set(() => ({ checkedCategory })),
    setCheckedTag: (checkedTag: Set<string>) => set(() => ({ checkedTag })),
    setFromDate: (fromDate: string) => set(() => ({ fromDate })),
    setToDate: (toDate: string) => set(() => ({ toDate })),
    reset: () => set(listingInitState),
  });
