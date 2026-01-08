

import {
  createFileRoute,
  useParams,
} from '@tanstack/react-router';
// import {
//   useContext,
// } from 'react';
import type {
  ReactNode,
} from 'react';
import { useUser } from '@clerk/clerk-react'


import Categories from '@/components/categories/Categories';
import Category from '@/components/category/Category';
import NotFound from '@/components/common/NotFound';
import { validateItemsUrlSearch } from '@/lib/helper/validator';
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
import Loading from '@/components/common/Loading';
import NotAuthorised from '@/components/common/NotAuthorised';
import { MainContainer } from '@/components/basics/Container';



export const Route = createFileRoute("/categories/$categoryFilter")({
  component: Items,
  notFoundComponent: NotFound,
});

function Items(): ReactNode {
  const { isSignedIn, user, isLoaded } = useUser();
  if (!isLoaded) return <Loading />
  if (!isSignedIn) return <NotAuthorised />

  const query = validateItemsUrlSearch(Route.useSearch());
  let pQ = {...query, userId: user?.id ?? ''};

  const { categoryFilter } = useParams({ strict: false });

  console.log("In index - category", categoryFilter)

  if (!categoryFilter){
    return (
      <MainContainer>
        <ItemSearchQueryContext value={pQ}>
          < Categories />
        </ItemSearchQueryContext>
      </MainContainer>
    );
  }
  // pQ = { ...query, userId: user?.id ?? '', categoryFilter: [category] };
  // pQ = { ...query, userId: user?.id ?? '', categoryFilter: [category] };

  return (
    <MainContainer>
      <ItemSearchQueryContext value={pQ}>
        < Category />
      </ItemSearchQueryContext>
    </MainContainer>
  );

}
