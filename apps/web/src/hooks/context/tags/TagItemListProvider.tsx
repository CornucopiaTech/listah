
import {
  useMemo,
  useCallback,
} from 'react';

import type {
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  type UseQueryResult,
} from '@tanstack/react-query';
import { useUser } from '@clerk/react';
import {
  useNavigate,
  getRouteApi,
} from '@tanstack/react-router';



// Internal imports
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import type {
  IItemListContext,
  IReadRequest,
  IChildReadRequest,
} from "@/domain/entities";
import {
  DefaultReadQuery,
  DefaultPagination,
  Pagination,
} from '@/domain/entities';
import {
  useListTag
} from './queries';
import {
  TagListContext
} from './useTag';
import {
  getRouteSearch,
} from "@/helpers/routing";
import {
  encodeState,
  decodeState,
} from '@/helpers/encoders';
import {
  useListItem,
} from '@/hooks/queries/item';
import type {
  IItemReadResponse,
} from '@/domain/entities';
import { ItemListContext } from "@/hooks/context/items";


export function TagItemListProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const storeSetItemScroll = useAppStore((state) => state.setItemScroll);
  const storeSetItemModal = useAppStore((state) => state.setItemModal);



  const navigate = useNavigate();
  // const search = getRouteSearch("/tags") as unknown as IReadRequest;
  // // const opts = {
  // //   ...search,
  // //   query: { ...search.query, userId: user?.id ?? "", },
  // // };
  // const { child, } = search;

  const routeApi = getRouteApi("/tags");
  const getUrlS = useCallback(() => {
    return routeApi.useSearch({ select: (search) => search.s, });
  }, [routeApi, getRouteApi,]);

  const getOpts = useCallback(() => {
    const routeApi = getRouteApi("/tags");
    const search = decodeState(routeApi.useSearch({ select: (search) => search.c, })) as unknown as IReadRequest;
    let opts = {} as IChildReadRequest;
    if (search) {
      const { query: urlQuery, pagination: urlPagination } = search;
      opts = {
        pagination: { ...urlPagination },
        query: { ...urlQuery, userId: user?.id ?? "", },
      };
    } else {
      opts = {
        query: { ...DefaultReadQuery, userId: user?.id ?? "", },
        pagination: { ...DefaultPagination, },
      };
    }
    return opts;
  }, [routeApi, getRouteApi,]);

  const opts = getOpts();
  const urlS = getUrlS();
  const {
    data, isPending, isError, error
  }: UseQueryResult<IItemReadResponse> = useListItem(opts);

  const items = data?.items ?? [];
  const childPaginationObj = data?.pagination ? data.pagination : opts?.pagination ? opts.pagination : DefaultPagination;

  const pagination = new Pagination(childPaginationObj);
  const pageSizeChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation()
    pagination.changeSize(e.target.value);
    const encoded = encodeState({
      ...opts, pagination: pagination.paging,
    });
    navigate({ to: ".", search: { s: urlS, c: encoded } });
  };
  const pageChange = (event: MouseEvent<HTMLButtonElement> | null, value: number) => {
    if (event) { event.stopPropagation() };
    pagination.changePage(value);
    const encoded = encodeState({
      ...opts, pagination: pagination.paging,
    });
    navigate({ to: ".", search: { s: urlS, c: encoded } });
  };

  const listItemClick = (idx: number) => {
    storeSetItemModal(true);
    storeSetItemScroll(idx);
  }


  const contextValue = useMemo(() => ({
    items,
    pagination,
    isPending,
    isError,
    error,
    pageChange,
    pageSizeChange,
    listItemClick,
  } as unknown as IItemListContext),
    [
      getUrlS,
      getOpts,
      items,
      pagination,
      isPending,
      isError,
      error,
      pageChange,
      pageSizeChange,
      listItemClick,
    ]
  );
  return <ItemListContext.Provider value={contextValue}> {children} </ItemListContext.Provider>
}
