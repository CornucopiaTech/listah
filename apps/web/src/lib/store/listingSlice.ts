import type { StateCreator } from 'zustand';



import type { IItem } from '@/lib/model/item';
import type {
  IListingState,
  IListingSlice,
  IStore,
} from '@/lib/model/store';
import type {
  ITag,
} from "@/lib/model/tag";
import type {
  IFilter,
} from "@/lib/model/filter";
import { DefaultItem, DefaultTag, DefaultFilter } from '../helper/defaults';




export const listingInitState: IListingState = {
  message: "",
  drawer: false,
  itemModal: false,
  filterModal: false,
  tagModal: false,
  settingModal: false,
  selectMode: false,
  displayItem: DefaultItem,
  displayTag: DefaultTag,
  displayFilter: DefaultFilter,
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
  setTagModal: (tagModal: boolean) => set(() => ({ tagModal })),
  setSettingModal: (settingModal: boolean) => set(() => ({ settingModal })),
  setSelectMode: (selectMode: boolean) => set(() => ({ selectMode })),
  setDisplayItem: (displayItem: IItem) => set(() => ({ displayItem })),
  setDisplayTag: (displayTag: ITag) => set(() => ({ displayTag })),
  setDisplayFilter: (displayFilter: IFilter) => set(() => ({ displayFilter })),
  setSearchQuery: (searchQuery: string) => set(() => ({ searchQuery })),
  setCheckedCategory: (checkedCategory: Set<string>) => set(() => ({ checkedCategory })),
  setCheckedTag: (checkedTag: Set<string>) => set(() => ({ checkedTag })),
  setFromDate: (fromDate: string) => set(() => ({ fromDate })),
  setToDate: (toDate: string) => set(() => ({ toDate })),
  reset: () => set(listingInitState),
});
