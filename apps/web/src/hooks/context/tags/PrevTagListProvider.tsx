
import {
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
} from '@tanstack/react-router';



// Internal imports
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import type {
  ITagListContext,
  ITagReadResponse,
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
  encodeState
} from '@/helpers/encoders';
import {
  useListItem,
} from '@/hooks/queries/item';
import type {
  IItemReadResponse,
} from '@/domain/entities';



export function TagListProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const storeSetTagScroll = useAppStore((state) => state.setTagScroll);
  const storeSetItemScroll = useAppStore((state) => state.setItemScroll);
  const storeSetItemModal = useAppStore((state) => state.setItemModal);



  const navigate = useNavigate();
  const search = getRouteSearch("/tags") as unknown as IReadRequest;
  const opts = {
    ...search,
    query: { ...search.query, userId: user?.id ?? "", },
  };
  const { query, pagination: urlTagPagination, child, } = opts;

  const { data, isPending, isError, error, }: UseQueryResult<ITagReadResponse> = useListTag({ query, pagination: urlTagPagination });
  const tags = data?.tags ?? [];
  const paginationObj = data?.pagination ? data.pagination : urlTagPagination ? urlTagPagination : DefaultPagination;
  const pagination = new Pagination(paginationObj);


  function pageChange(event: MouseEvent<HTMLButtonElement> | null, value: number) {
    if (event) { event.stopPropagation() };
    pagination.changePage(value);
    const s = encodeState({ query, child, pagination: pagination.paging });
    navigate({ to: ".", search: { s } });
  };
  function pageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    pagination.changeSize(e.target.value);
    const s = encodeState({ query, child, pagination: pagination.paging });
    navigate({ to: ".", search: { s } });
  };

  const listItemClick = (idx: number) => {
    const it = tags[idx];
    storeSetTagScroll(idx);
    storeSetItemScroll(0);
    const s = encodeState({
      query, pagination: pagination.paging,
      child: {
        query: { ...DefaultReadQuery, userId: query.userId, tags: [it.id] },
        pagination: { ...DefaultPagination, size: pagination.paging.size },
        id: it.id, name: it.name,
      }
    });
    navigate({ to: ".", search: { s } });
  }

  const breadcrumbClick = () => {
    const s = encodeState({ query, pagination: pagination.paging, });
    navigate({ to: ".", search: { s } });
  }


  // Define children
  let optsChild = {} as IChildReadRequest;
  if (child && child.query) {
    optsChild = {
      ...child,
      query: { ...child.query, userId: user?.id ?? "", },
    };
  } else if (tags.length > 0) {
    const it = tags[0];
    optsChild = {
      query: { ...DefaultReadQuery, userId: query.userId, tags: [it.id] },
      pagination: { ...DefaultPagination, size: pagination.paging.size },
      id: it.id, name: it.name,
    };
  }
  const {
    data: childData,
    isPending: chldPending,
    isError: chldError,
    error: childErr
  }: UseQueryResult<IItemReadResponse> = useListItem(optsChild);

  const items = childData?.items ?? [];
  const childPaginationObj = childData?.pagination ? childData.pagination : child?.pagination ? child.pagination : DefaultPagination;

  const childPagination = new Pagination(childPaginationObj);
  const childIsPending = chldPending;
  const childIsError = chldError;
  const childError = childErr;
  const childPageSizeChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation()
    childPagination.changeSize(e.target.value);
    const encoded = encodeState({
      query, pagination: pagination.paging,
      child: { ...optsChild, pagination: childPagination.paging },
    });
    navigate({ to: ".", search: { s: encoded } });
  };
  const childPageChange = (event: MouseEvent<HTMLButtonElement> | null, value: number) => {
    if (event) { event.stopPropagation() };
    childPagination.changePage(value);
    const encoded = encodeState({
      query, pagination: pagination.paging,
      child: {
        ...optsChild, pagination: childPagination.paging
      },
    });
    navigate({ to: ".", search: { s: encoded } });
  };

  const childListItemClick = (idx: number) => {
    storeSetItemModal(true);
    storeSetItemScroll(idx);
  }
  const breadcrumbTail = optsChild?.name ?? "";


  const contextValue = useMemo(() => ({
    tags,
    pagination,
    isPending,
    isError,
    error,
    pageChange,
    pageSizeChange,
    listItemClick,
    breadcrumbClick,
    breadcrumbTail,


    items,
    childPagination,
    childIsPending,
    childIsError,
    childError,
    childPageChange,
    childPageSizeChange,
    childListItemClick,
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
      breadcrumbClick,
      breadcrumbTail,


      items,
      childPagination,
      childIsPending,
      childIsError,
      childError,
      childPageChange,
      childPageSizeChange,
      childListItemClick,
    ]
  );
  // const contextValue = {
  //   tags,
  //   pagination,
  //   isPending,
  //   isError,
  //   error,
  //   pageChange,
  //   pageSizeChange,
  //   listItemClick,
  //   breadcrumbClick,
  //   breadcrumbTail,


  //   items,
  //   childPagination,
  //   childIsPending,
  //   childIsError,
  //   childError,
  //   childPageChange,
  //   childPageSizeChange,
  //   childListItemClick,
  // } as unknown as ITagListContext;

  return <TagListContext.Provider value={contextValue}> {children} </TagListContext.Provider>
}
