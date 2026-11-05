import type { StateCreator } from 'zustand';



import type {
  IFilterState,
  IFilterSlice,
  IStore,
  IFilter,
} from "@/app-types";


export const filterInitState: IFilterState = {
  filterModal: false,
  displayFilter: undefined,
  filterScroll: 0,
  filtersChecked: new Set([]),
  allFiltersChecked: false,
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
  setFiltersChecked: (filtersChecked: Set<string>) => set(() => ({ filtersChecked })),
  setAllFiltersChecked: (allFiltersChecked: boolean) => set(() => ({ allFiltersChecked })),
  reset: () => set(filterInitState),
});
