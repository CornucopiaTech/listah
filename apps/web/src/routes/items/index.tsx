
import {
  useQueryClient,
  useQuery,
  useQueries,
  useSuspenseQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import { createFileRoute} from '@tanstack/react-router';
import {
  Suspense,
  useContext,
} from 'react';
import type {
  ReactNode,
} from 'react';
import { Navigate } from '@tanstack/react-router';



import { itemLoader, itemGroupOptions, tagGroupOptions, categoryGroupOptions } from '@/lib/utils/querying';
import Page from '@/components/items/Page';
import NotFound from '@/components/common/NotFound';
import Loading from '@/components/common/Loading';
import { encodeState } from '@/lib/utils/encoders';
import { validateItemsUrlSearch } from '@/lib/utils/validator';
import { DefaultQueryParams, ITEMS_URL } from '@/lib/utils/defaults';
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
import { initalWebappContext, WebAppContext } from "@/lib/context/webappContext";


export const Route = createFileRoute(ITEMS_URL)({
  // loader: itemLoader,
  component: Items,
  notFoundComponent: NotFound,
});

function Items(): ReactNode {
  const query = validateItemsUrlSearch(Route.useSearch());
  const uId: str = useContext(WebAppContext);
  const pQ = {...query, userId: uId}

  return (
    <ItemSearchQueryContext value={pQ}>
      <Suspense fallback={<Loading />}>
        <Page />
      </Suspense>
    </ItemSearchQueryContext>
  );

}
