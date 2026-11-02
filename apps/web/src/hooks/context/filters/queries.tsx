import {
  queryOptions,
  useQueryClient,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import type {
  UseQueryResult,
} from '@tanstack/react-query';


// Internal
import type {
  IReadRequest,
  IFilterReadResponse,
  IFilter,
} from '@/domain/entities';
import {
  getFilter,
  postFilter,
} from '@/infra/api/filters';
import {
  QueryStaleTime,
} from '@/helpers/defaults';
import {
  ZFilter,
} from "@/domain/entities/filter";



export function filterGroupOptions(opts: IReadRequest) {
  return queryOptions({
    queryKey: ["filter", opts],
    queryFn: () => getFilter(opts),
    staleTime: QueryStaleTime,
    enabled: !!opts?.query?.userId,
  })
}
export function useViewFilterQuery(opts: IReadRequest): UseQueryResult<IFilterReadResponse> {
  return useQuery(filterGroupOptions(opts))
}


export function useUpdateFilterQuery() {
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
