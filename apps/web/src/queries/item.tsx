
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
} from "@/entities/item";
import {
  QueryStaleTime
} from '@/utils/defaults';
import type {
  IItem,
  IItemReadRequest,
  IItemReadResponse,
  // IItemRouteSearch,
} from "@/entities/item";
import {
  getItem,
  postItem,
} from '@/utils/fetchers';


if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
  console.info("Node environment", process.env.NODE_ENV)
}


export function useListItem(opts: IItemReadRequest): UseSuspenseQueryResult<IItemReadResponse> {
  return useSuspenseQuery(queryOptions({
    queryKey: ["item", opts],
    queryFn: () => getItem(opts),
    staleTime: QueryStaleTime,
    enabled: !!opts?.userId,
  }))
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
