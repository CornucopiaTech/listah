import {
  createFileRoute,
  Navigate,
} from '@tanstack/react-router';

import type {
  ReactNode,
} from 'react';
import {
  Protect
} from '@clerk/clerk-react';




import { Home } from '@/pages/Home';
import { DefaultHomeQueryParams } from '@/lib/helper/defaults';
import { encodeState } from '@/lib/helper/encoders';



export const Route = createFileRoute('/')({
  component: Page,
})


function Page(): ReactNode {
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
