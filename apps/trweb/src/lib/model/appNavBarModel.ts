
export const AppBarHeight = '64px';

export interface AppNavBarState {
  drawerOpen: boolean;
}

export interface AppNavBarActions {
  toggleDrawer: (drawerState: boolean) => void;
}

export interface AppNavBarStore extends AppNavBarState, AppNavBarActions{}
