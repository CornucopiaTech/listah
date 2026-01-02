
import {
  Fragment,
  type ReactNode,
} from 'react';
import Box from '@mui/material/Box';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { ThemeProvider } from '@mui/material/styles';



import { AppBarHeight } from '@/lib/model/appNavBarModel';
import AppNavBar from '@/components/common/AppNavBar';
import NotFound from '@/components/common/NotFound';


export const Route = createFileRoute("/items")({
  // loader: itemLoader,
  component: Items,
  notFoundComponent: NotFound,
});

function Items(): ReactNode {
  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <Box sx={{ height: '100%' }}>
          <AppNavBar />
            <Box sx={{ maxHeight: '720px', mt: AppBarHeight, p: 1 }}>
              <Outlet />
            </Box>
          </Box >
        </ThemeProvider>
    </Fragment>
  );
}
