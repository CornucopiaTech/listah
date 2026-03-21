import {
  createFileRoute,
  Navigate,
} from '@tanstack/react-router';
import type {
  ReactNode,
} from 'react';
import {
  Fragment,
} from 'react';
import {
  useUser
} from '@clerk/react';
import { Show, RedirectToSignIn } from '@clerk/react';
import LinearProgress from '@mui/material/LinearProgress';



import { ListItems } from "@/components/pages/ListItems";
import { DefaultQueryParams } from '@/lib/helper/defaults';
import { encodeState } from '@/lib/helper/encoders';
import { Landing } from '@/components/pages/Landing';

export const Route = createFileRoute('/filters/$name')({
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
      search={{ s: encodeState(DefaultQueryParams) as unknown as string }}
      replace
    />
  }

  return (
    <Fragment>
      <Show when="signed-in"> <ListItems /> </Show>
      <Show when="signed-out"> <RedirectToSignIn /> </Show>
    </Fragment>
  );
}
