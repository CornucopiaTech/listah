import type { StateCreator } from 'zustand';



import type { IItem } from '@/lib/model/item';
import type {
  IListingState,
  IListingSlice,
  IStore,
} from '@/lib/model/store';
import { DefaultItem } from '../helper/defaults';




export const listingInitState: IListingState = {
  message: "",
  drawer: false,
  itemModal: false,
  filterModal: false,
  settingModal: false,
  selectMode: false,
  displayId: '',
  displayItem: DefaultItem,
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
  setSettingModal: (settingModal: boolean) => set(() => ({ settingModal })),
  setSelectMode: (selectMode: boolean) => set(() => ({ selectMode })),
  setDisplayId: (displayId: string) => set(() => ({ displayId })),
  setDisplayItem: (displayItem: IItem) => set(() => ({ displayItem })),
  setSearchQuery: (searchQuery: string) => set(() => ({ searchQuery })),
  setCheckedCategory: (checkedCategory: Set<string>) => set(() => ({ checkedCategory })),
  setCheckedTag: (checkedTag: Set<string>) => set(() => ({ checkedTag })),
  setFromDate: (fromDate: string) => set(() => ({ fromDate })),
  setToDate: (toDate: string) => set(() => ({ toDate })),
  reset: () => set(listingInitState),
});
