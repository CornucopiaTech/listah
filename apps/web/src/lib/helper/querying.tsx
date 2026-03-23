
import {
  queryOptions,
} from '@tanstack/react-query';


import type {
  IItemReadRequest,
} from '@/lib/model/item';
import type { ITagReadRequest } from '@/lib/model/tag';
import type { IFilterReadRequest } from '@/lib/model/filter';
import {
  getItem, getFilter, getTag
} from '@/lib/helper/fetchers';




export function itemGroupOptions(opts: IItemReadRequest) {
  return queryOptions({
    queryKey: ["item", opts],
    queryFn: () => getItem(opts),
    staleTime: 60,
    // staleTime: 24 * 60 * 60 * 1000,
  })
}

export function filterGroupOptions(opts: IFilterReadRequest) {
  return queryOptions({
    queryKey: ["filter", opts],
    queryFn: () => getFilter(opts),
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
