
import {
  useCallback,
  useMemo,
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
  ITagListContext,
  ITagReadResponse,
  IReadRequest,
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
// import {
//   getRouteSearch,
// } from "@/helpers/routing";
import {
  encodeState,
  decodeState,
} from '@/helpers/encoders';



export function TagListProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const storeSetTagScroll = useAppStore((state) => state.setTagScroll);
  const storeSetItemScroll = useAppStore((state) => state.setItemScroll);
  const navigate = useNavigate();
  const routeApi = getRouteApi("/tags");
  const search = decodeState(routeApi.useSearch({ select: (search) => search.s, })) as unknown as IReadRequest;
  const { query: urlQuery, pagination: urlPagination } = search;
  const opts = {
    pagination: { ...urlPagination },
    query: { ...urlQuery, userId: user?.id ?? "", },
  };
  const urlC = routeApi.useSearch({ select: (search) => search.c, });

  const { data, isPending, isError, error, }: UseQueryResult<ITagReadResponse> = useListTag(opts);
  const tags = data?.tags ?? [];
  const paginationObj = data?.pagination ? data.pagination : urlPagination ? urlPagination : DefaultPagination;
  const pagination = new Pagination(paginationObj);


  const pageChange = useCallback((event: MouseEvent<HTMLButtonElement> | null, value: number) => {
    if (event) { event.stopPropagation() };
    pagination.changePage(value);
    const s = encodeState({ query: urlQuery, pagination: pagination.paging });
    navigate({ to: ".", search: { s, c: urlC } });
  }, [opts]);
  const pageSizeChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    pagination.changeSize(e.target.value);
    const s = encodeState({ query: urlQuery, pagination: pagination.paging });
    navigate({ to: ".", search: { s, c: urlC } });
  }, [opts]);

  const listItemClick = useCallback((idx: number) => {
    const it = tags[idx];
    storeSetTagScroll(idx);
    storeSetItemScroll(0);
    const s = encodeState({ query: opts.query, pagination: pagination.paging, });
    const c = encodeState({
      query: { ...DefaultReadQuery, userId: opts.query.userId, tags: [it.id] },
      pagination: { ...DefaultPagination, size: pagination.paging.size },
      id: it.id, name: it.name,
    });
    navigate({ to: ".", search: { s, c } });
  }, [opts]);


  const contextValue = useMemo(() => ({
    search,
    tags,
    pagination,
    isPending,
    isError,
    error,
    pageChange,
    pageSizeChange,
    listItemClick,
  } as unknown as ITagListContext),
    [
      search,
      tags,
      pagination,
      isPending,
      isError,
      error,
      pageChange,
      pageSizeChange,
      listItemClick,
    ]
  );

  return <TagListContext.Provider value={contextValue}> {children} </TagListContext.Provider>
}
