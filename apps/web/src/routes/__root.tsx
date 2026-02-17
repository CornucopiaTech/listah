import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Fragment } from 'react';


import NotFound from '@/components/common/NotFound';
import { AppContainer } from '@/components/layout/AppContainer';



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
      <AppContainer>
        <Outlet />
      </AppContainer>
    </Fragment>
  ),
  notFoundComponent: NotFound,
})
