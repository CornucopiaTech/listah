
import {
  Fragment,
  type ReactNode,
} from 'react';
import Box from '@mui/material/Box';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Protect } from '@clerk/clerk-react';


import AppNavBar from '@/components/common/AppNavBar';
import NotFound from '@/components/common/NotFound';
import NotAuthorised from '@/components/common/NotAuthorised';


export const Route = createFileRoute("/categories")({
  component: Items,
  notFoundComponent: NotFound,
});

function Items(): ReactNode {
  return (
    <Protect fallback={<NotAuthorised />}>
    <Fragment>
      <Box sx={{height: '100%',}}>
        <AppNavBar />
        <Outlet />
      </Box >
    </Fragment>
  </Protect>
  );
}
