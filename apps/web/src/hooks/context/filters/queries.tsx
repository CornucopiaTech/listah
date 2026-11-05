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
} from '@/app-types';
import {
  getFilter,
  postFilter,
} from '@/api/filters';
import {
  QueryStaleTime,
} from '@/helpers/defaults';
import {
  ZFilters,
} from "@/app-types/filter";



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


export function useUpdateFiltersQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mutateItem: IFilter[]) => {
      const mi = ZFilters.parse(mutateItem);
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
