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



import { Tags } from '@/components/pages/Tags';
import { DefaultTagRead } from '@/lib/helper/defaults';
import { encodeState } from '@/lib/helper/encoders';
import { Landing } from '@/components/pages/Landing';


export const Route = createFileRoute('/tags/')({
  component: Page,
})


function Page(): ReactNode {
  const { isSignedIn, isLoaded, } = useUser();
  if (!isLoaded) return <LinearProgress />
  if (!isSignedIn) return <Landing />

  const search: { s: string } = Route.useSearch();

  if (!search || Object.keys(search).length === 0 || !search.s) {
    return <Navigate
      to="/tags"
      from="/"
      search={{ s: encodeState(DefaultTagRead) as unknown as string }}
      replace
    />
  }

  return (
    <Fragment>
      <Show when="signed-in"> <Tags /> </Show>
      <Show when="signed-out"> <RedirectToSignIn /> </Show>
    </Fragment>
  );
}
