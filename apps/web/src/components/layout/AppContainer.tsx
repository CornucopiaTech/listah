

import {
  Fragment,
} from 'react';
import {
  Outlet,

} from '@tanstack/react-router';
import type {
  ReactNode
} from 'react';
import {
  useUser
} from '@clerk/react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';


import {
  AppNavBar,
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


export function AppContainer({ children, mw, menuItems, title }: { children: ReactNode, menuItems?: ReactNode, mw?: widthType, title?: string }) {
  return (
    <Fragment>
      <AppNavBar menuItems={menuItems} title={title} />
      <Container maxWidth={mw ? mw : "xl"}
        sx={{ marginTop: "60px" }} >
        {children}
      </Container>
    </Fragment>
  );
}
