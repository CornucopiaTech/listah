import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import ItemDetails from "@/components/item/ItemDetails";
// import { ErrorAlerts } from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';




export const Route = createFileRoute('/item/$id/')({
  component: () => { return <Suspense fallback={<Loading/>}> <ItemDetails/> </Suspense>},
  // component: () => { <Suspense fallback={<Loading/>}> <Items /> </Suspense>},
  // loader: () => queryClient.ensureQueryData(itemsQueryOptions),
  // errorComponent: ({ error, reset }) => {
  //   return (<ErrorAlerts> {error} </ErrorAlerts>);
  // },
})
