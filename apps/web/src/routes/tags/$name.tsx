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



import { ListItems } from "@/components/pages/ListItems";
import { DefaultTagRead } from '@/lib/helper/defaults';
import { encodeState } from '@/lib/helper/encoders';
import { Landing } from '@/components/pages/Landing';

export const Route = createFileRoute('/tags/$name')({
  beforeLoad: ({ search }) => {
    if (!search || Object.keys(search).length === 0 || !search.s) {
      throw redirect({
        to: '..',
        search: { s: encodeState(DefaultTagRead) as unknown as string },
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
      <Show when="signed-in"> <ListItems /> </Show>
      <Show when="signed-out"> <RedirectToSignIn /> </Show>
    </Fragment>
  );
}
