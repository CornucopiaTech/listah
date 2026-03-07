import {
  createFileRoute,
  Navigate,
} from '@tanstack/react-router';

import type {
  ReactNode,
} from 'react';
import {
  Protect,
  useUser
} from '@clerk/clerk-react';
import LinearProgress from '@mui/material/LinearProgress';



import { Home } from '@/components/pages/Home';
import { DefaultHomeQueryParams } from '@/lib/helper/defaults';
import { encodeState } from '@/lib/helper/encoders';
import { Landing } from '@/components/pages/Landing';


export const Route = createFileRoute('/')({
  component: Page,
})


function Page(): ReactNode {
  const { isSignedIn, isLoaded, } = useUser();
  if (!isLoaded) return <LinearProgress />
  if (!isSignedIn) return <Landing />

  const search: { s: string } = Route.useSearch();

  if (!search || Object.keys(search).length === 0 || !search.s) {
    return <Navigate
      to="/"
      search={{s: encodeState(DefaultHomeQueryParams) as unknown as string}}
      replace
    />
  }

  return (
    <Protect>
      <Home />
    </Protect>
  );
}
