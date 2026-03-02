import {
  createFileRoute,
  Navigate,
} from '@tanstack/react-router';

import type {
  ReactNode,
} from 'react';
import { useUser } from '@clerk/clerk-react';
import { Protect } from '@clerk/clerk-react'




import Loading from '@/components/common/Loading';
import { Landing } from '@/pages/Landing';
import { Home } from '@/pages/Home';
import { DefaultHomeQueryParams } from '@/lib/helper/defaults';
import { encodeState } from '@/lib/helper/encoders';



export const Route = createFileRoute('/')({
  // beforeLoad: ({ search, context}) => {
  //   // console.info("In / route before load - context ", context);
  //   // console.info("In / route before load - search ", search);
  // },
  component: Page,
})


function Page(): ReactNode {
  // const context = Route.useRouteContext()
  const { isSignedIn, isLoaded } = useUser();
  const search = Route.useSearch();

  if (!isLoaded) return <Loading />
  if (!isSignedIn) return <Landing />

  if (!search || Object.keys(search).length === 0 || !search.s) {
    console.info("In validateHomeUrlSearch - using default");
    // return encodeState(DefaultHomeQueryParams) as unknown as string;
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
