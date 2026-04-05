
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


const staleTime = process.env.NODE_ENV === "production" ? 24 * 60 * 60 * 1000 : 10;
if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
  console.info("Node environment", process.env.NODE_ENV)
}

export function itemQueryOptions(opts: IItemReadRequest) {
  return {
    queryKey: ["item", opts],
    queryFn: () => getItem(opts),
    staleTime: staleTime,
  }
}

export function itemGroupOptions(opts: IItemReadRequest) {
  return queryOptions({
    queryKey: ["item", opts],
    queryFn: () => getItem(opts),
    staleTime: staleTime,
  })
}

export function filterGroupOptions(opts: IFilterReadRequest) {
  return queryOptions({
    queryKey: ["filter", opts],
    queryFn: () => getFilter(opts),
    staleTime: staleTime,
  })
}

export function tagGroupOptions(opts: ITagReadRequest) {
  return queryOptions({
    queryKey: ["tag", opts],
    queryFn: () => getTag(opts),
    staleTime: staleTime,
  })
}
