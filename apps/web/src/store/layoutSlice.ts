import type { StateCreator } from 'zustand';



import type {
  ILayoutState,
  ILayoutSlice,
  IStore,
} from '@/entities/store';





export const layoutInitState: ILayoutState = {
  drawerOpen: false,
  searchQuery: undefined,
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
  reset: () => set(layoutInitState),
});
