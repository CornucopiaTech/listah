


import {
  Fragment,
} from 'react';
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
import { AppNavDrawer } from "@/components/layout/AppNavDrawer";
import {
  AppAllowance,
} from '@/utils/defaults';
import { SpaceBetweenBox, CentredBox } from '@/components/core/AppBox';

type widthType = "xs" | "sm" | "md" | "lg" | "xl";


function Shell({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          width: "100vw", maxWidth: "100vw", height: `100vh`,
        }}>
        {children}
      </Box>
    </Fragment>
  );
}


export function AppShell({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded, } = useUser();
  if (!isLoaded) return <Shell><LinearProgress /></Shell>
  if (!isSignedIn) return <Shell><Landing /></Shell>
  return (
    <Fragment>
      <Shell>
        <AppNavDrawer />
        {children}
      </Shell>
    </Fragment>
  );
}


export function PrevAppContainer(
  {
    children, mw, title, menuItems, displayPage }: {
      children: ReactNode, mw?: widthType, title?: string,
      menuItems?: ReactNode, displayPage?: boolean
    }) {
  const theme = useTheme<AppTheme>();
  return (
    <Grid container spacing={0}>
      {/* {displayPage && <Grid key="menu" size={0.5}> <AppMenuButton /> </Grid>} */}
      <Grid key="main content" size={displayPage ? 11.5 : 12} >
        <Container maxWidth={mw ? mw : "md"} sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // Vertically centers the content inside the container
          alignItems: 'center',     // Horizontally centers the content inside the container
          minHeight: '100vh',       // Forces the container to take up the full screen height
        }}>
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



export function AppContainer({ children, mw }: { children: ReactNode, mw?: widthType, }) {
  const theme: AppTheme = useTheme();
  const appbarAllowance = `calc(${theme.spacing(7)} + 1px)`;
  const pageHeight = `calc(100vh - ${AppAllowance}px)`;
  return (
    <Fragment>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${appbarAllowance}px`, // key part: reserves drawer space
          mt: `${AppAllowance}px`, // key part: reserves drawer space
          display: "flex",
          justifyContent: "center", // horizontal centering
          alignItems: 'center',     // Horizontally centers the content inside the container
          minHeight: pageHeight,
        }}>

        <Container maxWidth={mw ? mw : "md"} sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // Vertically centers the content inside the container
          alignItems: 'center',     // Horizontally centers the content inside the container
          maxHeight: pageHeight,       // Forces the container to take up the full screen height
        }}>
          <AppPagePaper>
            <Stack direction="column" spacing={0} sx={{ marginTop: "10px" }}>
              {children}
            </Stack>
          </AppPagePaper>
        </Container>
      </Box>
    </Fragment>
  );
}
