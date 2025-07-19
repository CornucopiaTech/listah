import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import Items from "@/components/items/Items";
// import { ErrorAlerts } from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';




export const Route = createFileRoute('/items/')({
  component: () => { return <Suspense fallback={<Loading/>}> <Items /> </Suspense>},
  // component: () => { <Suspense fallback={<Loading/>}> <Items /> </Suspense>},
  // loader: () => queryClient.ensureQueryData(itemsQueryOptions),
  // errorComponent: ({ error, reset }) => {
  //   return (<ErrorAlerts> {error} </ErrorAlerts>);
  // },
})
