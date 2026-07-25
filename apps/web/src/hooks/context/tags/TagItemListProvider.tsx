
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
  IUrlSearch,
  IItemReadResponse,
} from "@/domain/entities";
import {
  DefaultPagination,
  Pagination,
} from '@/domain/entities';
import {
  encodeState,
  decodeState,
} from '@/helpers/encoders';
import {
  useListItem,
  ItemListContext,
} from "@/hooks/context/items";


export function TagItemListProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const storeSetItemScroll = useAppStore((state) => state.setItemScroll);
  const navigate = useNavigate();
  const routeApi = getRouteApi("/tags");
  const { query: urlQuery, pagination: urlPagination } = decodeState(routeApi.useSearch({ select: (search) => search.c, })) as unknown as IReadRequest;
  const opts = {
    pagination: { ...urlPagination },
    query: { ...urlQuery, userId: user?.id ?? "", },
  };
  const {
    data, isPending, isError, error
  }: UseQueryResult<IItemReadResponse> = useListItem(opts);

  const items = data?.items ?? [];
  const paginationObj = data?.pagination ? data.pagination : opts?.pagination ? opts.pagination : DefaultPagination;
  const pagination = new Pagination(paginationObj);

  const pageSizeChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation()
    pagination.changeSize(e.target.value);
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        const dPrev = decodeState(prev.c) as unknown as IChildReadRequest;
        return { ...prev, c: encodeState({ ...dPrev, pagination: pagination.paging }) }
      }
    });
  }, [opts]);
  const pageChange = useCallback((event: MouseEvent<HTMLButtonElement> | null, value: number) => {
    if (event) { event.stopPropagation() };
    pagination.changePage(value);
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        const dPrev = decodeState(prev.c) as unknown as IChildReadRequest;
        return { ...prev, c: encodeState({ ...dPrev, pagination: pagination.paging }) }
      }
    });
  }, [opts]);
  const editItemClick = useCallback((idx: number) => {
    storeSetItemScroll(idx);
    const it = items[idx];
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        return {
          ...prev, e: encodeState({ obj: it, flag: true, modal: "item" })
        }
      }
    });
  }, [opts]);


  const contextValue = useMemo(() => ({
    items,
    pagination,
    isPending,
    isError,
    error,
    pageChange,
    pageSizeChange,
    editItemClick,
  } as unknown as IItemListContext), [opts]);
  return <ItemListContext.Provider value={contextValue}> {children} </ItemListContext.Provider>
}
