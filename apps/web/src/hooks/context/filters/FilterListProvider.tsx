
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
} from '@tanstack/react-router';



// Internal imports
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import type {
  IFilterListContext,
  IFilterReadResponse,
  IReadRequest,
} from "@/domain/entities";
import {
  DefaultReadQuery,
  DefaultPagination,
  Pagination,
} from '@/domain/entities';
import {
  useListFilter
} from '@/hooks/queries';
import {
  FilterListContext
} from './useFilter';
import {
  getRouteSearch,
} from "@/helpers/routing";
import {
  encodeState
} from '@/helpers/encoders';





export function FilterListProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const storeSetItemTitle = useAppStore((state) => state.setItemTitle);
  const storeSetDisplayFilter = useAppStore((state) => state.setDisplayFilter);
  const storeSetFilterScroll = useAppStore((state) => state.setFilterScroll);
  const storeSetItemScroll = useAppStore((state) => state.setItemScroll);


  const navigate = useNavigate();
  const search = getRouteSearch("/filters") as unknown as IReadRequest;
  const opts = {
    ...search,
    query: { ...search.query, userId: user?.id ?? "", },
  };
  const { query, pagination: urlPagination } = opts;

  const {
    data, isPending, isError, error, isFetching,
  }: UseQueryResult<IFilterReadResponse> = useListFilter(opts);
  console.info({
    isPending, isError, error, isFetching,
  });
  const filters = data?.filters ?? [];
  const paginationObj = data?.pagination ? data.pagination : urlPagination ? urlPagination : DefaultPagination;
  const pagination = new Pagination(paginationObj);


  function pageChange(event: MouseEvent<HTMLButtonElement> | null, value: number) {
    if (event) { event.stopPropagation() };
    pagination.changePage(value);
    const s = encodeState({ query, pagination: pagination.paging });
    navigate({ to: ".", search: { s } });
  };
  function pageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    pagination.changeSize(e.target.value);
    const s = encodeState({ query, pagination: pagination.paging });
    navigate({ to: ".", search: { s } });
  };
  const listItemClick = (idx: number) => {
    const it = filters[idx];
    const pageTitle = it && it.name ? `##${it.name}` : "Items";
    const s = encodeState({
      query: { ...DefaultReadQuery, userId: query.userId, tags: [...it.tags] },
      pagination: { ...DefaultPagination, size: pagination.paging.size },
      title: pageTitle,
      reference: { filter: it },
    })
    navigate({ to: "/items", search: { s }, });
    storeSetItemTitle(pageTitle);
    storeSetDisplayFilter(it);
    storeSetFilterScroll(idx);
    storeSetItemScroll(0);
  }



  const contextValue = {
    query,
    filters,
    pagination,
    isPending,
    isFetching,
    isError,
    error,
    pageChange,
    pageSizeChange,
    listItemClick,
  } as unknown as IFilterListContext;

  return <FilterListContext.Provider value={contextValue}>
    {children}
  </FilterListContext.Provider>
}
