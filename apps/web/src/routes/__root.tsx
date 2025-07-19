import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Suspense } from 'react';

import Header from '../components/Header';
import Loading from '@/components/common/Loading';

export const Route = createRootRoute({
  component: () => (
    <Suspense fallback={<Loading/>}>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </Suspense>
  ),
})
