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
  IFilterReadRequest,
  IFilterReadResponse,
} from '@/entities/filter';
import {
  getFilter,
  postFilter,
} from '@/utils/fetchers';
import {
  QueryStaleTime,
} from '@/utils/defaults';
import type {
  IFilter,
} from "@/entities/filter";
import {
  ZFilter,
} from "@/entities/filter";


export function useListFilter(opts: IFilterReadRequest): UseSuspenseQueryResult<IFilterReadResponse> {
  return useSuspenseQuery(queryOptions({
    queryKey: ["filter", opts],
    queryFn: () => getFilter(opts),
    staleTime: QueryStaleTime,
    enabled: !!opts?.userId,
  }))
}


export function useUpdateFilter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mutateItem: IFilter) => {
      const mi = ZFilter.parse(mutateItem);
      return postFilter(mi);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["filter"] }),
      ])
    },
    onError: (error) => {
      if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
        console.log(error);
      }
    },
  });
}
