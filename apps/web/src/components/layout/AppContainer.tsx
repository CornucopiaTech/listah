


import {
  Fragment,
} from 'react';
import {
  Outlet,
} from '@tanstack/react-router';
import {
  useUser
} from '@clerk/react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
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
import {
} from "@/domain/rules";
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
import type { AppTheme } from '@/system/theme';




import {
  AppMenuButton,
} from '@/components/layout/AppNavBar';
import { Landing } from '@/components/pages/Landing';


type widthType = "xs" | "sm" | "md" | "lg" | "xl";



export function AppShell({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      <CssBaseline />
      <Box sx={{ width: "100vw", maxWidth: "100vw", height: `fit-content`, }}>
        {children}
      </Box>
    </Fragment>
  );
}


export function AppContainerShell() {
  const { isSignedIn, isLoaded, } = useUser();
  if (!isLoaded) return <AppShell><LinearProgress /></AppShell>
  if (!isSignedIn) return <AppShell><Landing /></AppShell>
  return <AppShell><Outlet /></AppShell>;
}

export function AppContainer(
  { children, mw, title, menuItems, displayPage }: {
    children: ReactNode, mw?: widthType, title?: string, menuItems?: ReactNode, displayPage?: boolean
  }) {
  const theme = useTheme<AppTheme>();
  return (
    <Grid container spacing={0} padding="10px" margin="10px">
      {displayPage && <Grid key="menu" size={1}> <AppMenuButton /> </Grid>}
      <Grid key="main content" size={displayPage ? 11 : 12}>
        <Container maxWidth={mw ? mw : "md"} >
          <AppPagePaper key="tags">
            <Stack direction="column" spacing={0}>
              {displayPage && <Grid container spacing={0}>
                <Grid key="title" size={11}>
                  <Typography variant="h6" sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}
                  > {title || ""} </Typography>
                </Grid>
                <Grid key="kebab" size={1} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", }}>
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
                </Grid>
              </Grid>}
              {displayPage && <AppItemSearchBar />}
              {children}
            </Stack>
          </AppPagePaper>
        </Container>
      </Grid>
    </Grid>
  );
}
