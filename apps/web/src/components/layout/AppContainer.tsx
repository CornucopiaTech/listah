


import {
  Fragment,
} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import type {
  ReactNode,
} from 'react';
import Typography from '@mui/material/Typography';
import { Icon } from "@iconify/react";
import { useTheme } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";



// Internal
import {
  AppPagePaper,
} from '@/components/core/AppPaper';
import type { AppTheme } from '@/system/theme';
import {
  Menubar,
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
} from '@/components/base/Menubar';
import {
  AppItemSearchBar,
} from "@/components/layout/AppSearchBar";
import { AppNavDrawer } from "@/components/layout/AppNavDrawer";
import {
  AppPageAllowance,
  AppPageContentHeight,
} from '@/helpers/defaults';
import { SpaceBetweenBox, CentredBox } from '@/components/core/AppBox';
import {
  AppDrawerWidth,
} from '@/helpers/defaults';
import {
  useAppStore,
} from '@/hooks/store/boundStore';


type widthType = "xs" | "sm" | "md" | "lg" | "xl";


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
  const theme: AppTheme = useTheme();
  const appbarAllowance = `calc(${theme.spacing(7)} + 1px)`;
  return (
    <Fragment>
      <AppNavDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${appbarAllowance}px`, // key part: reserves drawer space
          mt: `${AppPageAllowance}px`, // key part: reserves drawer space
          display: "flex",
          justifyContent: "center", // horizontal centering
          alignItems: 'center',     // Horizontally centers the content inside the container
          minHeight: AppPageContentHeight,
        }}>
        {children}
      </Box>
    </Fragment>
  );
}

export function AppListHeader({ title, menuItems }: { title?: string, menuItems?: ReactNode, }) {
  const theme = useTheme<AppTheme>();
  return (
    <Fragment>
      <SpaceBetweenBox>
        <CentredBox><Typography variant="h5" component="div"> {title} </Typography></CentredBox>
        <Menubar style={{
          backgroundColor: theme.palette.background.paper,
          display: "flex", justifyContent: "flex-end", alignItems: "center",
        }}>
          <MenuRoot>
            <MenuTrigger>
              <Icon
                icon="charm:menu-kebab" width="30" height="30"
                style={{ color: theme.palette.primary.main }}
              />
            </MenuTrigger>
            <MenuPortal>
              <MenuPositioner sideOffset={4} alignOffset={-2}>
                <MenuPopup>
                  {menuItems}
                </MenuPopup>
              </MenuPositioner>
            </MenuPortal>
          </MenuRoot>
        </Menubar>

      </SpaceBetweenBox>
      <AppItemSearchBar />
    </Fragment>
  );
}



export function PrevAppContainer({ children, mw }: { children: ReactNode, mw?: widthType, }) {
  return (
    <Container maxWidth={mw ? mw : "md"} sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center', // Vertically centers the content inside the container
      alignItems: 'center',     // Horizontally centers the content inside the container
      maxHeight: AppPageContentHeight,       // Forces the container to take up the full screen height
    }}>
      {/* <Stack direction="column" spacing={0} sx={{ marginTop: "10px" }}> */}
      <Box sx={{ width: "100%" }}>
        {children}
      </Box>

      {/* </Stack> */}
    </Container>
  );
}


export function AppContainer({ children, mw }: { children: ReactNode, mw?: widthType, }) {
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
      <Box sx={{ width: "100%", margin: "10px" }}>
        {children}
      </Box>
    </Box>
  );
}
