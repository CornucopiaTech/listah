
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




// Internal
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import {
  useListItem,
} from '@/hooks/queries/item';
import {
  DefaultPagination,
  Pagination,
} from '@/domain/entities';
import type {
  IItemReadResponse,
} from '@/domain/entities';
import type {
  IItemListContext,
  IReadRequest,
} from "@/domain/entities";
import {
  ItemListContext
} from './useItem';
import {
  getRouteSearch,
} from "@/helpers/routing";
import {
  encodeState
} from '@/helpers/encoders';








export function ItemListProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const storeItemTitle = useAppStore((state) => state.itemTitle);
  const storeDisplayTag = useAppStore((state) => state.displayTag);
  const storeDisplayFilter = useAppStore((state) => state.displayFilter);
  const storeSetDisplayItem = useAppStore((state) => state.setDisplayItem);
  const storeSetItemModal = useAppStore((state) => state.setItemModal);
  const storeSetItemScroll = useAppStore((state) => state.setItemScroll);
  const navigate = useNavigate();
  const search = getRouteSearch("/items") as unknown as IReadRequest;
  const opts = {
    ...search,
    query: { ...search.query, userId: user?.id ?? "", },
  };
  const { query, pagination: urlPagination, reference, title: urlTitle } = opts;

  const {
    data, isPending, isError, error, isFetching,
  }: UseQueryResult<IItemReadResponse> = useListItem(opts);
  const items = data?.items ?? [];
  const paginationObj = data?.pagination ? data.pagination : urlPagination ? urlPagination : DefaultPagination;
  const pagination = new Pagination(paginationObj);

  const title = urlTitle ? urlTitle : "All Items";
  const passedTag = storeDisplayTag || reference?.tag;
  const passedFilter = storeDisplayFilter || reference?.filter;


  function pageChange(event: MouseEvent<HTMLButtonElement> | null, value: number) {
    if (event) { event.stopPropagation() };
    pagination.changePage(value);
    const encoded = encodeState({ query, title, reference, pagination: pagination.paging });
    navigate({ to: ".", search: { s: encoded } });
  };
  function pageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    pagination.changeSize(e.target.value);
    const encoded = encodeState({ query, title, reference, pagination: pagination.paging });
    navigate({ to: ".", search: { s: encoded } });
  };



  const listItemClick = (idx: number) => {
    const it = items[idx];
    storeSetDisplayItem(it);
    storeSetItemModal(true);
    storeSetItemScroll(idx);
  }



  const contextValue = {
    query,
    reference,
    passedTag,
    passedFilter,
    title,
    items,
    pagination,
    isPending,
    isFetching,
    isError,
    error,
    pageChange,
    pageSizeChange,
    listItemClick,
  } as unknown as IItemListContext;

  return <ItemListContext.Provider value={contextValue}>
    {children}
  </ItemListContext.Provider>
}
