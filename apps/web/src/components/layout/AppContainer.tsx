

import {
  Fragment,
} from 'react';
import { Outlet } from '@tanstack/react-router';
import type {
  ReactNode
} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';


import {
  AppTabNavBar,
  AppNavBar,
} from '@/components/core/AppNavBar';


type widthType = "xs" | "sm" | "md" | "lg" | "xl";



export function AppContainerShell() {
  return (
    <Fragment>
      <CssBaseline />
      <Box sx={{ width: "100vw", maxWidth: "100vw", height: `fit-content`, }}>
        <AppNavBar />
        {/* <AppTabNavBar /> */}
        <Outlet />
      </Box>
    </Fragment>
  );
}


export function AppContainer({ children, mw }: { children: ReactNode, mw?: widthType }) {
  return (
    <Fragment>
      <Container maxWidth={mw ? mw : "xl"} sx={{ marginTop: "3%" }}>
        {children}
      </Container>
    </Fragment>
  );
}
