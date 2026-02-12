
import {
  queryOptions,
  type QueryClient
} from '@tanstack/react-query';


import type { IItemsSearch } from '@/lib/model/Items';
import { getItem, getCategory, getTag } from '@/lib/helper/fetchers';
import { validateItemsUrlSearch } from '@/lib/helper/validator';
import { DefaultQueryParams, } from '@/lib/helper/defaults';




export function itemGroupOptions(opts: IItemsSearch) {
  return queryOptions({
    queryKey: ["item", opts],
    queryFn: () => getItem(opts),
    staleTime: 60,
    // staleTime: 24 * 60 * 60 * 1000,
  })
}


export function tagGroupOptions(opts: string) {
  return queryOptions({
    queryKey: ["tag", opts],
    queryFn: () => getTag(opts),
    staleTime: 60,
    // staleTime: 24 * 60 * 60 * 1000,
  })
}


export function categoryGroupOptions(opts: string) {
  return queryOptions({
    queryKey: ["category", opts],
    queryFn: () => getCategory(opts),
    staleTime: 60,
    // staleTime: 24 * 60 * 60 * 1000,
  })
}


// export function itemLoader(opts: ZItemsSearch) {
//   return {
//     queries: [
//       itemGroupOptions(opts),
//       tagGroupOptions(opts.userId),
//       categoryGroupOptions(opts.userId),
//     ]
//   }
// }


export function getQueryOptions(q: IItemsSearch): object[] {
  const uId = q && q.userId ? q.userId : "";
  return [
    itemGroupOptions(q),
    tagGroupOptions(uId),
    categoryGroupOptions(uId),
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
  let query: IItemsSearch;
  if (!search || Object.keys(search).length === 0 || !search.s) {
    query = DefaultQueryParams
  } else {
    query = validateItemsUrlSearch(search);
  }
  const uId = query && query.userId ? query.userId : "";

  // Kick off the fetching of some slower data, but do not await it
  context.queryClient.prefetchQuery(itemGroupOptions(query));
  context.queryClient.prefetchQuery(categoryGroupOptions(uId));
  context.queryClient.prefetchQuery(tagGroupOptions(uId));
}
