import type { TraceBaggage, ItemProto, ItemsProto } from '@/lib/model/ItemsModel';
import {
  propagation,
  context,
} from '@opentelemetry/api';
import {
  queryOptions,
} from '@tanstack/react-query';


import { getItem, getCategory, getTag } from '@/lib/utils/fetchers';
import { validateItemsUrlSearch } from '@/lib/utils/validator';
import { DefaultQueryParams, ITEMS_URL } from '@/lib/utils/defaults';




export function itemGroupOptions(opts: ItemsSearchSchema) {
  return queryOptions({
    queryKey: ["item", opts],
    queryFn: () => getItem(opts),
    staleTime: 24 * 60 * 60 * 1000,
  })
}


export function tagGroupOptions(opts: string) {
  return queryOptions({
    queryKey: ["tag", opts],
    queryFn: () => getTag(opts),
    staleTime: 24 * 60 * 60 * 1000,
  })
}


export function categoryGroupOptions(opts: string) {
  return queryOptions({
    queryKey: ["category", opts],
    queryFn: () => getCategory(opts),
    staleTime: 24 * 60 * 60 * 1000,
  })
}


// export function itemLoader(opts: ItemsSearchSchema) {
//   return {
//     queries: [
//       itemGroupOptions(opts),
//       tagGroupOptions(opts.userId),
//       categoryGroupOptions(opts.userId),
//     ]
//   }
// }


export function getQueryOptions(q) {
  return [
    itemGroupOptions(q),
    tagGroupOptions(q.userId),
    categoryGroupOptions(q.userId),
  ]
}


export function itemLoader({ params, search, context }) {
  console.info("In itemsLoader ", params, search, context);
  let query;
  if (!search || Object.keys(search).length === 0 || !search.s) {
    query = DefaultQueryParams
    console.info("In ItemPage - using default");
  } else {
    query = validateItemsUrlSearch(search);
  }
  console.info("In itemsLoader - query", query);

  // Kick off the fetching of some slower data, but do not await it
  context.queryClient.prefetchQuery(itemGroupOptions(query));
  context.queryClient.prefetchQuery(categoryGroupOptions(query.userId));
  context.queryClient.prefetchQuery(tagGroupOptions(query.userId));

}
