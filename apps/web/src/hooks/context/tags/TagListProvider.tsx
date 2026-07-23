
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
  IReadQuery,
  IPagination,
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



export function TagListProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const storeSetTagScroll = useAppStore((state) => state.setTagScroll);
  const storeSetItemScroll = useAppStore((state) => state.setItemScroll);
  const navigate = useNavigate();
  const routeApi = getRouteApi("/tags");
  const urlQuery = routeApi.useSearch({ select: (search) => search.query, }) as unknown as IReadQuery;
  const urlPagination = routeApi.useSearch({ select: (search) => search.pagination, }) as unknown as IPagination;
  const opts = {
    pagination: { ...urlPagination },
    query: { ...urlQuery, userId: user?.id ?? "", },
  };

  const { data, isPending, isError, error, }: UseQueryResult<ITagReadResponse> = useListTag(opts);
  const tags = data?.tags ?? [];
  const paginationObj = data?.pagination ? data.pagination : urlPagination ? urlPagination : DefaultPagination;
  const pagination = new Pagination(paginationObj);


  const pageChange = useCallback((event: MouseEvent<HTMLButtonElement> | null, value: number) => {
    if (event) { event.stopPropagation() };
    pagination.changePage(value);
    navigate({ to: ".", search: (prev) => ({ ...prev, pagination: pagination.paging }) });
  }, [opts]);
  const pageSizeChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    pagination.changeSize(e.target.value);
    navigate({ to: ".", search: (prev) => ({ ...prev, pagination: pagination.paging }) });
  }, [opts]);

  const listItemClick = useCallback((idx: number) => {
    const it = tags[idx];
    storeSetTagScroll(idx);
    storeSetItemScroll(0);
    const c = {
      query: { ...DefaultReadQuery, userId: opts.query.userId, tags: [it.id] },
      pagination: { ...DefaultPagination, size: pagination.paging.size },
      id: it.id, name: it.name,
    };
    navigate({ to: ".", search: (prev) => ({ ...prev, c }) });
  }, [opts]);


  const contextValue = useMemo(() => ({
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
