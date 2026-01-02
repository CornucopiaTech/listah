
import {
  Fragment,
  type ReactNode,
} from 'react';
import Box from '@mui/material/Box';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Protect } from '@clerk/clerk-react';


import { AppBarHeight } from '@/lib/model/appNavBarModel';
import AppNavBar from '@/components/common/AppNavBar';
import NotFound from '@/components/common/NotFound';
import { MainContainer } from '@/components/basics/Container';


export const Route = createFileRoute("/items")({
  // loader: itemLoader,
  component: Items,
  notFoundComponent: NotFound,
});

function Items(): ReactNode {
  return (
    <Protect fallback={<p>Users that are signed-out can see this.</p>}>
    <Fragment>
      <Box
        sx={{
            height: '95vh',
          // height: '100%'
        }}
        >
        <AppNavBar />
          {/* <MainContainer sx={{ maxHeight: '960px', p: 1, height: '95vh', }}> */}
            <Outlet />
          {/* </MainContainer> */}
      </Box >
    </Fragment>
  </Protect>
  );
}
