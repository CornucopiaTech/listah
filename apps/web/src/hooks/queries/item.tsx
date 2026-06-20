
import {
  queryOptions,
  useQueryClient,
  useMutation,
  useSuspenseQuery,
} from '@tanstack/react-query';
import type {
  UseSuspenseQueryResult,
} from '@tanstack/react-query';


// Internal imports
import {
  ZItem
} from "@/domain/entities";
import type {
  IItem,
  IReadRequest,
  IItemReadResponse,
  // IItemRouteSearch,
} from "@/domain/entities";
import {
  getItem,
  postItem,
} from '@/infra/api';
import {
  QueryStaleTime
} from '@/utils/defaults';

if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
  console.info("Node environment", process.env.NODE_ENV)
}




export function itemGroupOptions(opts: IReadRequest) {
  return queryOptions({
    queryKey: ["item", opts],
    queryFn: () => getItem(opts),
    staleTime: QueryStaleTime,
    enabled: !!opts?.query?.userId,
  });
}


export function useListItem(opts: IReadRequest): UseSuspenseQueryResult<IItemReadResponse> {
  return useSuspenseQuery(itemGroupOptions(opts))
}


export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mutateItem: IItem) => {
      const mi = ZItem.parse(mutateItem);
      return postItem(mi);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["item"] }),
        queryClient.invalidateQueries({ queryKey: ["tag"] }),
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
