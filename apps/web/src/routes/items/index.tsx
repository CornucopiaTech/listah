

import { createFileRoute} from '@tanstack/react-router';
import {
  useContext,
} from 'react';
import type {
  ReactNode,
} from 'react';




import Page from '@/components/items/Page';
import NotFound from '@/components/common/NotFound';
import { validateItemsUrlSearch } from '@/lib/helper/validator';
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
import { WebAppContext } from "@/lib/context/webappContext";

export const Route = createFileRoute("/items/")({
  // loader: itemLoader,
  component: Items,
  notFoundComponent: NotFound,
});

function Items(): ReactNode {
  const query = validateItemsUrlSearch(Route.useSearch());
  const appCtx = useContext(WebAppContext);
  const uId: str = appCtx.userId;
  const pQ = {...query, userId: uId}

  return (
    <ItemSearchQueryContext value={pQ}>
      <Page />
    </ItemSearchQueryContext>
  );

}
