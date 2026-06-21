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
import {
  DefaultReadRequest,
  DefaultPagination,
  DefaultReadQuery,
} from '@/domain/entities';
import { useUser } from '@clerk/react';


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


export function useUpdateTagUpdateCache() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mutateTag: ITag) => {
      // const opts = { pagination: { ...DefaultPagination, size: -1 }, query: { ...DefaultReadQuery, userId: mutateTag.userId } }
      // const oldData = queryClient.getQueryData(['tag', opts]);
      // const oldTag = oldData?.tags?.filter((i) => i.id == mutateTag.id)
      // console.info('In useUpdateTag before mutation. old data', { oldData, mutateTag, oldTag });

      const mi = ZTag.parse(mutateTag);
      await postTag(mi);
      // const mId: { tagIds: string[] } = await postTag(mi);
      return mutateTag;
      // return postTag(mi);
    },
    onSuccess: async (mutatedTag: ITag) => {
      // ToDo: Use mutation to update the cache so stale tag is not shown.
      // queryClient.setQueriesData(
      //   { queryKey: ['tag'] },
      //   (old: ITagReadResponse) => {
      //     // console.info('In cache update. old and mutated Tag', { old, mutatedTag })
      //     if (!old) {
      //       // console.info('In cache update. no old returning')
      //       return old
      //     };
      //     // console.info('In cache update. updating')
      //     return { ...old, tags: old.tags.map((u: ITag) => u.id === mutatedTag.id ? mutatedTag : u) }
      //   }
      // );
      // const opts = { pagination: { ...DefaultPagination, size: -1 }, query: { ...DefaultReadQuery, userId: mutatedTag.userId } }
      // const newData = queryClient.getQueryData(['tag', opts]);
      // const newTag = newData.tags.filter((i) => i.id == mutatedTag.id)
      // console.info('In useUpdateTag after mutation cache update. new data', { newData, mutatedTag, newTag });

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

export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mutateTag: ITag) => {
      const mi = ZTag.parse(mutateTag);
      return postTag(mi);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tag"], refetchType: 'all', }),
        queryClient.invalidateQueries({ queryKey: ["item"], refetchType: 'all', }),
      ])
    },
    onError: (error) => {
      if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
        console.log(error);
      }
    },
  });
}
