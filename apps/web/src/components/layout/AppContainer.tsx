


import {
  Fragment,
} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import type {
  ReactNode,
} from 'react';
import { styled, useTheme } from '@mui/material/styles';



// Internal
import type { AppTheme } from '@/system/theme';
import {
  AppNavDrawer,
  DrawerHeader,

} from "@/components/layout/AppNavDrawer";
import {
  AppPageContentHeight,
} from '@/helpers/defaults';
import {
  AppDrawerWidth,
} from '@/helpers/defaults';
import {
  useAppStore,
} from '@/hooks/store/boundStore';


export function GlobalShell({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          width: "100vw", maxWidth: "100vw", height: `100vh`,
          overflowX: "hidden",
        }}>
        {children}
      </Box>
    </Fragment>
  );
}


export function AppShell({ children }: { children: ReactNode }) {
  // const theme: AppTheme = useTheme();
  const storeDrawerOpen = useAppStore((state) => state.drawerOpen);
  // const appbarAllowance = storeDrawerOpen ? AppDrawerWidth : 0;
  // const appbarAllowance = storeDrawerOpen ? 0 : -AppDrawerWidth;
  const appbarAllowance = 0;
  const minWidth = `calc(100vw - ${appbarAllowance})`;
  return (
    <Fragment>
      <AppNavDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${appbarAllowance}px`, // key part: reserves drawer space
          display: "flex",
          justifyContent: "center", // horizontal centering
          alignItems: 'center',     // Horizontally centers the content inside the container
          minHeight: AppPageContentHeight,
          minWidth,
        }}>
        {children}
      </Box>
    </Fragment>
  );
}


export function AppContainer({ children }: { children: ReactNode, }) {
  const storeDrawerOpen = useAppStore((state) => state.drawerOpen);
  const theme: AppTheme = useTheme();
  const appbarWidth = storeDrawerOpen ? `calc(100% - ${AppDrawerWidth}px)` : `calc(100% - calc(${theme.spacing(7)} + 1px))`;
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center', // Vertically centers the content inside the container
      alignItems: 'center',     // Horizontally centers the content inside the container
      maxHeight: AppPageContentHeight,       // Forces the container to take up the full screen height
      minWidth: `${appbarWidth}`,
      maxWidth: `${appbarWidth}`,
    }}>
      <Box sx={{ width: "100%", margin: "10px" }}> {children} </Box>
    </Box>
  );
}
