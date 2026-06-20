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
import {
  ZTag,
} from "@/domain/entities";
import type {
  ITag,
  IReadRequest,
  ITagReadResponse,
  ITagPropertyReadResponse,
} from '@/domain/entities';
import {
  getTag,
  getTagProperty,
  postTag,
} from '@/infra/api';
import {
  QueryStaleTime,
} from '@/utils/defaults';


// ToDo: Take ceiling for page count
export function tagGroupOptions(opts: IReadRequest) {
  return queryOptions({
    queryKey: ["tag", opts],
    queryFn: () => getTag(opts),
    staleTime: QueryStaleTime,
    enabled: !!opts?.query?.userId,
  })
}

export function useListTag(opts: IReadRequest): UseSuspenseQueryResult<ITagReadResponse> {
  return useSuspenseQuery(tagGroupOptions(opts))
}



export function tagPropertyGroupOptions(opts: IReadRequest) {
  // console.info('tagPropertyGroupOptions', opts);
  return queryOptions({
    queryKey: ["tagProperty", opts],
    queryFn: () => getTagProperty(opts),
    staleTime: QueryStaleTime,
    enabled: !!opts?.query?.userId,
  })
}

export function useListTagProperty(opts: IReadRequest): UseSuspenseQueryResult<ITagPropertyReadResponse> {
  // console.info('useListTagProperty', opts);
  return useSuspenseQuery(tagPropertyGroupOptions(opts))
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
