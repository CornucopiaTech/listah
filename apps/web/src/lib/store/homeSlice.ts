import type { StateCreator } from 'zustand';



import type {
  IHomeState,
  IHomeSlice,
  IStore,
} from '@/lib/model/store';
import type {
  ITag,
} from "@/lib/model/tag";
import type {
  IFilter,
} from "@/lib/model/filter";
// import { DefaultTag, DefaultFilter } from '../helper/defaults';




export const homeInitState: IHomeState = {
  filterModal: false,
  tagModal: false,
  settingModal: false,
  displayTag: undefined,
  displayFilter: undefined,
  // displayTag: DefaultTag,
  // displayFilter: DefaultFilter,
  // homeSearchQuery: '',
  homeSearchQuery: undefined,
}

export const createHomeSlice: StateCreator<
  IStore,
  [['zustand/devtools', never]],
  [],
  IHomeSlice
> = (set) => ({
  ...homeInitState,
  setFilterModal: (filterModal: boolean) => set(() => ({ filterModal })),
  setTagModal: (tagModal: boolean) => set(() => ({ tagModal })),
  setSettingModal: (settingModal: boolean) => set(() => ({ settingModal })),
  setDisplayTag: (displayTag: undefined | ITag) => set(() => ({ displayTag })),
  setDisplayFilter: (displayFilter: undefined | IFilter) => set(() => ({ displayFilter })),
  setHomeSearchQuery: (homeSearchQuery: undefined | string) => set(() => ({ homeSearchQuery })),
  reset: () => set(homeInitState),
});
