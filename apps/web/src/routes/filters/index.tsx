import {
  createFileRoute,
  redirect,
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



import { Filters } from '@/components/pages/Filters';
import { DefaultFilterRead } from '@/lib/helper/defaults';
import { encodeState } from '@/lib/helper/encoders';
import { Landing } from '@/components/pages/Landing';


export const Route = createFileRoute('/filters/')({
  beforeLoad: ({ search }) => {
    if (!search || Object.keys(search).length === 0 || !search.s) {
      throw redirect({
        to: ".",
        search: { s: encodeState(DefaultFilterRead) as unknown as string },
      })
    }
  },
  component: Page,
})


function Page(): ReactNode {
  const { isSignedIn, isLoaded, } = useUser();
  if (!isLoaded) return <LinearProgress />
  if (!isSignedIn) return <Landing />

  return (
    <Fragment>
      <Show when="signed-in"> <Filters /> </Show>
      <Show when="signed-out"> <RedirectToSignIn /> </Show>
    </Fragment>
  );
}
