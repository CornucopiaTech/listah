
import {
  queryOptions,
  useQueryClient,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import type {
  UseQueryResult,
} from '@tanstack/react-query';


// Internal imports
import {
  ZItems
} from "@/app-types";
import type {
  IItem,
  IReadRequest,
  IItemReadResponse,
} from "@/app-types";
import {
  getItem,
  postItem,
} from '@/api';
import {
  QueryStaleTime
} from '@/helpers/defaults';

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


export function useViewItemQuery(opts: IReadRequest): UseQueryResult<IItemReadResponse> {
  return useQuery(itemGroupOptions(opts))
}


export function useUpdateItemsQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mutateItem: IItem[]) => {
      const mi = ZItems.parse(mutateItem);
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
