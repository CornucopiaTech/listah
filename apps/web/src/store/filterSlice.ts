import type { StateCreator } from 'zustand';



import type {
  IFilterState,
  IFilterSlice,
  IStore,
} from '@/entities/store';
import type {
  IFilter,
} from "@/entities/filter";
// import { DefaultTag, DefaultFilter } from '@/utils/defaults';


export const filterInitState: IFilterState = {
  filterModal: false,
  displayFilter: undefined,
  filterScroll: 0,
}


export const createFilterSlice: StateCreator<
  IStore,
  [['zustand/devtools', never]],
  [],
  IFilterSlice
> = (set) => ({
  ...filterInitState,
  setFilterModal: (filterModal: boolean) => set(() => ({ filterModal })),
  setDisplayFilter: (displayFilter: undefined | IFilter) => set(() => ({ displayFilter })),
  setFilterScroll: (filterScroll: undefined | number) => set(() => ({ filterScroll })),
  reset: () => set(filterInitState),
});
