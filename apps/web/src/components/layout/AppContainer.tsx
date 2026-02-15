import {
  Fragment,
} from 'react';
import type {
  ReactNode
} from 'react';
// import { useTheme } from '@mui/material/styles';
// import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
// import type { AppTheme } from '@/system/theme';
import AppNavBar from '@/components/core/AppNavBar';
import {
  AppContainerStack,
  // AppPageStack
} from "@/components/core/AppBox";




export function AppContainer({ children }: { children: ReactNode }) {
  // const theme: AppTheme = useTheme();
  return (
    <Fragment>
      <CssBaseline />

      {/* <Container maxWidth="xl" sx={{
        height: 'fit-content', bgcolor: theme.palette.background.default,
        m:0, p:0, display: "flex", justifyContent: "center", alignContent: "center",
        }}> */}

          {/* {children} */}
              {/* <AppPageStack>
          <AppNavBar />
          {children}
              </AppPageStack> */}

        <AppContainerStack>
        <AppNavBar />
          {children}
        </AppContainerStack>


      {/* </Container> */}
    </Fragment>
  );
}
