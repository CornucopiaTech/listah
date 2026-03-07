import {
  Fragment,
} from 'react';
import type {
  ReactNode
} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';


import AppNavBar from '@/components/core/AppNavBar';
import {
  AppContainerStack,
} from "@/components/core/AppBox";




export function AppContainer({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      <CssBaseline />
        <AppContainerStack>
        <AppNavBar />
        <Container maxWidth="xl">
          {children}
        </Container>
        </AppContainerStack>
    </Fragment>
  );
}
