
import { createFileRoute} from '@tanstack/react-router';
import { Suspense } from 'react';
import { Navigate } from '@tanstack/react-router';



import Items from '@/components/items/read/Items';
import NotFound from '@/components/common/NotFound';
import Loading from '@/components/common/Loading';
import { encodeState } from '@/lib/utils/encoders';
import { validateItemsUrlSearch } from '@/lib/utils/validator';
import { DefaultQueryParams, ITEMS_URL } from '@/lib/utils/defaults';



export const Route = createFileRoute(ITEMS_URL)({
  component: ItemPage,
  notFoundComponent: NotFound,
})

function ItemPage() {
  const searchParams = Route.useSearch()
  console.info("In Items Page - Search Params ", searchParams);



  if (Object.keys(searchParams).length === 0 || !searchParams.s) {
    console.info("In ItemPage - using default");
    return <Navigate
      to={ITEMS_URL}
        search={{ s: encodeState(DefaultQueryParams) }}
      />
  }
  const query = validateItemsUrlSearch(searchParams);
  console.info("In Page - Items");
  console.info(query);
  return (
    <Suspense fallback={Loading}><Items query={query}/></Suspense>
  );
}
