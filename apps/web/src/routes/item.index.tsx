import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import {
  useQuery,
  useQueryClient,
  useMutation,
  queryOptions,
  QueryClient,
  type UseQueryResult
} from '@tanstack/react-query';


import ItemDetails, { itemGroupOptions } from "@/components/item/Item";
// import { ErrorAlerts } from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';




export const Route = createFileRoute('/item/')({
  component: () => { return <Suspense fallback={<Loading/>}> <ItemDetails/> </Suspense>},
  loaderDeps: ({ search: { userId, category, tags, id } }) => ({ userId, category, tags, id }),
  loader: ({ deps: { userId, category, tags, id } }) => {
    const queryClient = new QueryClient();
    queryClient.ensureQueryData(itemGroupOptions(userId, category, tags, id))
  },
});
