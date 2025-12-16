import { createStore } from 'zustand/vanilla';
import type { AppNavBarState, AppNavBarStore, } from '@/lib/model/appNavBarModel';



export const defaultPagesInitState: AppNavBarState = {
  drawerOpen: false,
}
export const createAppNavBarStore = (
  initState: AppNavBarState = defaultPagesInitState,
) => {
  return createStore<AppNavBarStore>()((set) => ({
    ...initState,
    toggleDrawer: (drawerState: boolean) => set(() => ({ drawerOpen: drawerState })),

  }))
}
