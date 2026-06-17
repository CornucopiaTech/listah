import {
  queryOptions,
  useQueryClient,
  useMutation,
  useSuspenseQuery,
} from '@tanstack/react-query';
import type {
  UseSuspenseQueryResult,
} from '@tanstack/react-query';


// Internal
import type {
  ITagReadRequest,
  ITagReadResponse,
  ITagPropertyReadRequest,
  ITagPropertyReadResponse,
} from '@/domain/entities/tag';
import {
  getTag,
  getTagProperty
} from '@/utils/fetchers';
import {
  QueryStaleTime
} from '@/utils/defaults';
import { postTag } from "@/utils/fetchers";
import type {
  ITag,
} from "@/domain/entities/tag";
import {
  ZTag,
} from "@/domain/entities/tag";



export function useListTag(opts: ITagReadRequest): UseSuspenseQueryResult<ITagReadResponse> {
  return useSuspenseQuery(queryOptions({
    queryKey: ["tag", opts],
    queryFn: () => getTag(opts),
    staleTime: QueryStaleTime,
    enabled: !!opts?.userId,
  }))
}

export function useListTagProperty(opts: ITagPropertyReadRequest): UseSuspenseQueryResult<ITagPropertyReadResponse> {
  return useSuspenseQuery(queryOptions({
    queryKey: ["tagProperty", opts],
    queryFn: () => getTagProperty(opts),
    staleTime: QueryStaleTime,
    enabled: !!opts?.userId,
  }))
}


export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mutateTag: ITag) => {
      const mi = ZTag.parse(mutateTag);
      return postTag(mi);
    },
    onSuccess: async () => {
      // ToDo: Use mutation to update the cache so stale tag is not shown.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tag"], refetchType: 'all', }),
        queryClient.invalidateQueries({ queryKey: ["item"], refetchType: 'all', }),
      ])
      // router.push()
    },
    onError: (error) => {
      if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
        console.log(error);
      }
      // form.reset()
    },
  });
}
