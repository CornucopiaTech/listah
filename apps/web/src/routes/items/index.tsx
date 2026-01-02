

import { createFileRoute} from '@tanstack/react-router';
// import {
//   useContext,
// } from 'react';
import type {
  ReactNode,
} from 'react';
import { useUser } from '@clerk/clerk-react'



import Page from '@/components/items/Page';
import NotFound from '@/components/common/NotFound';
import { validateItemsUrlSearch } from '@/lib/helper/validator';
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
// import { WebAppContext } from "@/lib/context/webappContext";
import Loading from '@/components/common/Loading';
import NotAuthorised from '@/components/common/NotAuthorised';
import { MainContainer } from '@/components/basics/Container';



export const Route = createFileRoute("/items/")({
  component: Items,
  notFoundComponent: NotFound,
});

function Items(): ReactNode {
  const { isSignedIn, user, isLoaded } = useUser();
  if (!isLoaded) return <Loading />
  if (!isSignedIn) return <NotAuthorised />

  const query = validateItemsUrlSearch(Route.useSearch());
  // const appCtx = useContext(WebAppContext);
  // const uId: str = appCtx.userId;
  const pQ = {...query, userId: user?.id ?? ''};

  return (
    <MainContainer sx={{ maxHeight: '960px', height: '95vh', }}>
      <ItemSearchQueryContext value={pQ}>
        <Page />
      </ItemSearchQueryContext>
    </MainContainer>


  );

}
