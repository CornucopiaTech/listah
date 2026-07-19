
import type {
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  type UseSuspenseQueryResult,
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
  ITagDataContext,
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
} from '@/hooks/queries';
import {
  TagDataContext
} from './useTag';
import {
  getRouteSearch,
} from "@/utils/routing";
import {
  encodeState
} from '@/utils/encoders';





export function TagDataProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const storeSetItemTitle = useAppStore((state) => state.setItemTitle);
  const storeSetDisplayTag = useAppStore((state) => state.setDisplayTag);
  const storeSetTagScroll = useAppStore((state) => state.setTagScroll);


  const navigate = useNavigate();
  const search = getRouteSearch("/tags") as unknown as IReadRequest;
  const opts = {
    ...search,
    query: { ...search.query, userId: user?.id ?? "", },
  };
  const { query, pagination: urlPagination } = opts;

  const {
    data, isPending, isError, error, isFetching,
  }: UseSuspenseQueryResult<ITagReadResponse> = useListTag(opts);
  const tags = data?.tags ?? [];
  const paginationObj = data?.pagination ? data.pagination : urlPagination ? urlPagination : DefaultPagination;
  const pagination = new Pagination(paginationObj);


  function pageChange(event: MouseEvent<HTMLButtonElement> | null, value: number) {
    if (event) { event.stopPropagation() };
    pagination.changePage(value);
    const encoded = encodeState({ query, pagination: pagination.paging });
    navigate({ to: ".", search: { s: encoded } });
  };
  function pageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    pagination.changeSize(e.target.value);
    const encoded = encodeState({ query, pagination: pagination.paging });
    navigate({ to: ".", search: { s: encoded } });
  };
  const listItemClick = (idx: number) => {
    const it = tags[idx];
    const pageTitle = it && it.name ? `#${it.name}` : "Items";
    const s = encodeState({
      query: { ...DefaultReadQuery, userId: query.userId, tags: [it.id] },
      pagination: { ...DefaultPagination, size: pagination.paging.size },
      title: pageTitle,
      reference: { tag: it },
    })
    navigate({ to: "/items", search: { s }, });
    storeSetItemTitle(pageTitle);
    storeSetDisplayTag(it);
    storeSetTagScroll(idx);
  }



  const contextValue = {
    query,
    tags,
    pagination,
    isPending,
    isFetching,
    isError,
    error,
    pageChange,
    pageSizeChange,
    listItemClick,
  } as unknown as ITagDataContext;

  return <TagDataContext.Provider value={contextValue}>
    {children}
  </TagDataContext.Provider>
}
