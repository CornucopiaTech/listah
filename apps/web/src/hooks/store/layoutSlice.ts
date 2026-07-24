import type { StateCreator } from 'zustand';



import type {
  ILayoutState,
  ILayoutSlice,
  IStore,
} from '@/domain/entities/store';





export const layoutInitState: ILayoutState = {
  drawerOpen: false,
  searchQuery: undefined,
  successMsg: undefined,
  warnMsg: undefined,
  errorMsg: undefined,
}

export const createLayoutSlice: StateCreator<
  IStore,
  [['zustand/devtools', never]],
  [],
  ILayoutSlice
> = (set) => ({
  ...layoutInitState,
  toggleDrawer: (drawerOpen: boolean) => set(() => ({ drawerOpen })),
  setSearchQuery: (searchQuery: undefined | string) => set(() => ({ searchQuery })),
  setErrorMsg: (errorMsg: null | undefined | string) => set(() => ({ errorMsg })),
  setWarnMsg: (warnMsg: null | undefined | string) => set(() => ({ warnMsg })),
  setSuccessMsg: (successMsg: null | undefined | string) => set(() => ({ successMsg })),
  reset: () => set(layoutInitState),
});
