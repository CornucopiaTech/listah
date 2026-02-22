
import {
  queryOptions,
  type QueryClient
} from '@tanstack/react-query';


import type {
  IItemRequest,
} from '@/lib/model/item';
import type {
  ICategoryRequest,
} from '@/lib/model/category';
import { getItem, getCategory } from '@/lib/helper/fetchers';
import { validateItemsUrlSearch } from '@/lib/helper/validator';
import { DefaultQueryParams, } from '@/lib/helper/defaults';




export function itemGroupOptions(opts: IItemRequest) {
  return queryOptions({
    queryKey: ["item", opts],
    queryFn: () => getItem(opts),
    staleTime: 60,
    // staleTime: 24 * 60 * 60 * 1000,
  })
}

export function categoryGroupOptions(opts: ICategoryRequest) {
  return queryOptions({
    queryKey: ["category", opts],
    queryFn: () => getCategory(opts),
    staleTime: 60,
    // staleTime: 24 * 60 * 60 * 1000,
  })
}


export function getQueryOptions(q: IItemRequest | ICategoryRequest): object[] {
  return [
    itemGroupOptions(q),
    categoryGroupOptions(q),
  ]
}


export function itemLoader(
  {
    search, context
  }: {
      search: { s: string },
      context: { queryClient: QueryClient }
  }
) {
  let query: IItemRequest;
  if (!search || Object.keys(search).length === 0 || !search.s) {
    query = DefaultQueryParams
  } else {
    query = validateItemsUrlSearch(search);
  }
  // Kick off the fetching of some slower data, but do not await it
  context.queryClient.prefetchQuery(itemGroupOptions(query));
  context.queryClient.prefetchQuery(categoryGroupOptions(query));
}
