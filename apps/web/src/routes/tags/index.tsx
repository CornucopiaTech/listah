

import {
  createFileRoute,
} from '@tanstack/react-router';
import type {
  ReactNode,
} from 'react';
import { useUser } from '@clerk/clerk-react'


import Tags from '@/components/tags/Tags';
import NotFound from '@/components/common/NotFound';
import { validateItemsUrlSearch } from '@/lib/helper/validator';
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
import Loading from '@/components/common/Loading';
import NotAuthorised from '@/components/common/NotAuthorised';
import { MainContainer } from '@/components/basics/Container';



export const Route = createFileRoute("/tags/")({
  component: Items,
  notFoundComponent: NotFound,
});

function Items(): ReactNode {
  const { isSignedIn, user, isLoaded } = useUser();
  if (!isLoaded) return <Loading />
  if (!isSignedIn) return <NotAuthorised />

  const query = validateItemsUrlSearch(Route.useSearch());
  const pQ = {...query, userId: user?.id ?? ''};

  return (
    <MainContainer>
      <ItemSearchQueryContext value={pQ}>
        < Tags />
      </ItemSearchQueryContext>
    </MainContainer>
  );

}
