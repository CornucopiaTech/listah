import { createFileRoute} from '@tanstack/react-router';

import type {
  ReactNode,
} from 'react';
import { useUser } from '@clerk/clerk-react';


import { validateItemsUrlSearch } from '@/lib/helper/validator';
import { SearchQueryContext } from '@/lib/context/queryContext';
import Loading from '@/components/common/Loading';
import { Landing } from '@/pages/Landing';
import { Home } from '@/pages/Home';


export const Route = createFileRoute('/')({
  component: Page,
})


function Page(): ReactNode {
  const { isSignedIn, user, isLoaded } = useUser();
  if (!isLoaded) return <Loading />
  if (!isSignedIn) return <Landing />

  const query = validateItemsUrlSearch(Route.useSearch());
  const pQ = {...query, userId: user?.id ?? ''};

  return (
    <SearchQueryContext value={pQ}>
      <Home />
    </SearchQueryContext>
  );
}
