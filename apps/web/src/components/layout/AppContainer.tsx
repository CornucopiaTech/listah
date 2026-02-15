import {
  Fragment,
} from 'react';
import type {
  ReactNode
} from 'react';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppTheme } from '@/system/theme';






export function AppContainer({ children }: { children: ReactNode }) {
  const theme: AppTheme = useTheme();
  return (
    <Fragment>
      <CssBaseline />
      <Container maxWidth="xl" sx={{
        height: '100vh', bgcolor: theme.palette.background.default,
        m:0, p:0, display: "flex", justifyContent: "center", alignContent: "center",
        }}>
          {children}
      </Container>
    </Fragment>
  );
}
