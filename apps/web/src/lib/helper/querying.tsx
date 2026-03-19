
import {
  queryOptions,
} from '@tanstack/react-query';


import type {
  IItemReadRequest,
} from '@/lib/model/item';
import type { ITagReadRequest } from '@/lib/model/tag';
import type { IFilterReadRequest } from '@/lib/model/filter';
import {
  getItem, getSavedFilter, getTag
} from '@/lib/helper/fetchers';




export function itemGroupOptions(opts: IItemReadRequest) {
  return queryOptions({
    queryKey: ["item", opts],
    queryFn: () => getItem(opts),
    staleTime: 60,
    // staleTime: 24 * 60 * 60 * 1000,
  })
}

export function savedFilterGroupOptions(opts: IFilterReadRequest) {
  return queryOptions({
    queryKey: ["savedFilter", opts],
    queryFn: () => getSavedFilter(opts),
    staleTime: 60,
    // staleTime: 24 * 60 * 60 * 1000,
  })
}

export function tagGroupOptions(opts: ITagReadRequest) {
  return queryOptions({
    queryKey: ["tag", opts],
    queryFn: () => getTag(opts),
    staleTime: 60,
    // staleTime: 24 * 60 * 60 * 1000,
  })
}
