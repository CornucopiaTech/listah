
import {
  queryOptions,
} from '@tanstack/react-query';


import type {
  IItemReadRequest,
} from '@/lib/model/item';
import type { ITagCategoryReadRequest } from '@/lib/model/tag';
import type { ISavedFilterCategoryReadRequest } from '@/lib/model/savedFilter';
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

export function savedFilterGroupOptions(opts: ISavedFilterCategoryReadRequest) {
  return queryOptions({
    queryKey: ["savedFilter", opts],
    queryFn: () => getSavedFilter(opts),
    staleTime: 60,
    // staleTime: 24 * 60 * 60 * 1000,
  })
}

export function tagGroupOptions(opts: ITagCategoryReadRequest) {
  return queryOptions({
    queryKey: ["tag", opts],
    queryFn: () => getTag(opts),
    staleTime: 60,
    // staleTime: 24 * 60 * 60 * 1000,
  })
}

