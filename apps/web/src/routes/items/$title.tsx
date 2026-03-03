import {
  createFileRoute,
  Navigate,
} from '@tanstack/react-router';

import type {
  ReactNode,
} from 'react';
import { Protect } from '@clerk/clerk-react';


import { ListItems } from "@/pages/ListItems";
import { DefaultQueryParams } from '@/lib/helper/defaults';
import { encodeState } from '@/lib/helper/encoders';

export const Route = createFileRoute('/items/$title')({
  component: Page,
})


function Page(): ReactNode {
  const search = Route.useSearch();
  if (!search || Object.keys(search).length === 0 || !search.s) {
    return <Navigate
      to="/"
      search={{ s: encodeState(DefaultQueryParams) as unknown as string}}
      replace
    />
  }

  return (
    <Protect>
      <ListItems />
    </Protect>
  );
}
