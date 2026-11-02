
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
  ISearchItemsContext,
  ISearchReadRequest,
  IChildReadRequest,
  IUrlSearch,
  IItemReadResponse,
  IRouteStrings,
} from "@/domain/entities";
import {
  DefaultPagination,
  Pagination,
  DefaultEditor,
  DefaultSearchReadRequest,
} from '@/domain/entities';
import {
  encodeState,
  decodeState,
} from '@/helpers/encoders';
import {
  useViewItemQuery,
  SearchItemsContext,

} from "@/hooks/context/items";


export function SearchItemsProvider({ children, route }: { children: ReactNode, route: IRouteStrings }) {
  const { user } = useUser();
  const storeSetItemScroll = useAppStore((state) => state.setItemScroll);
  const navigate = useNavigate();
  const routeApi = getRouteApi(route);
  // @ts-ignore
  const { query: urlQuery, pagination: urlPagination, flag } = decodeState(routeApi.useSearch({ select: (search) => search.s, })) as unknown as ISearchReadRequest;
  const opts = {
    pagination: { ...urlPagination },
    query: { ...urlQuery, userId: user?.id ?? "", },
  };
  const {
    data, isPending, isError, error
  }: UseQueryResult<IItemReadResponse> = useViewItemQuery(opts);

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
        const dPrev = decodeState(prev.s) as unknown as IChildReadRequest;
        return { ...prev, s: encodeState({ ...dPrev, pagination: pagination.paging }) }
      }
    });
  }, [opts, flag]);


  const pageSortChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation()
    pagination.changeSort(e.target.value);
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        const dPrev = decodeState(prev.s) as unknown as IChildReadRequest;
        return { ...prev, s: encodeState({ ...dPrev, pagination: pagination.paging }) }
      }
    });
  }, [opts, flag]);


  const pageChange = useCallback((event: MouseEvent<HTMLButtonElement> | null, value: number) => {
    if (event) { event.stopPropagation() };
    pagination.changePage(value);
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        const dPrev = decodeState(prev.s) as unknown as IChildReadRequest;
        return { ...prev, s: encodeState({ ...dPrev, pagination: pagination.paging }) }
      }
    });
  }, [opts, flag]);
  const editItemClick = useCallback((idx: number) => {
    storeSetItemScroll(idx);
    const it = items[idx];
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        return {
          // p: prev.p, c: prev.c, e: encodeState({ obj: it, flag: true, modal: "item" })
          ...prev, e: encodeState({ obj: it, flag: true, modal: "item" })
        }
      }
    });
  }, [opts, flag]);

  const search = opts.query.text;
  const openDialog = flag ?? false;
  const closeDialog = () => {
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => { return { ...prev, e: encodeState(DefaultEditor), s: encodeState(DefaultSearchReadRequest) } }
    });
  };


  const contextValue = useMemo(() => ({
    route,
    search,
    items,
    pagination,
    isPending,
    isError,
    error,
    pageChange,
    pageSizeChange,
    pageSortChange,
    editItemClick,
    openDialog,
    closeDialog,
  } as unknown as ISearchItemsContext), [opts, flag]);
  return <SearchItemsContext.Provider value={contextValue}> {children} </SearchItemsContext.Provider>
}
