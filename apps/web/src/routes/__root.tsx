import { Outlet, createRootRoute } from '@tanstack/react-router';
import CssBaseline from '@mui/material/CssBaseline';
import { Fragment } from 'react';


import NotFound from '@/components/common/NotFound';



export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Listah',
      },
    ],
  }),
  component: () => (
    <Fragment>
      <CssBaseline />
      <Outlet />
    </Fragment>
  ),
  notFoundComponent: NotFound,
})
