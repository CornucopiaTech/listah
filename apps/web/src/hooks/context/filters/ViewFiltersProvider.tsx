
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
  IViewFiltersContext,
  IFilterReadResponse,
  IReadRequest,
  IUrlSearch,
} from "@/domain/entities";
import {
  DefaultReadQuery,
  DefaultPagination,
  Pagination,
} from '@/domain/entities';
import {
  useViewFilterQuery
} from './queries';
import {
  ViewFiltersContext
} from './useFilter';
import {
  encodeState,
  decodeState
} from '@/helpers/encoders';





export function ViewFiltersProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const storeSetFilterScroll = useAppStore((state) => state.setFilterScroll);
  const storeSetItemScroll = useAppStore((state) => state.setItemScroll);
  const navigate = useNavigate();
  const routeApi = getRouteApi("/filters");
  const { query: urlQuery, pagination: urlPagination } = decodeState(routeApi.useSearch({ select: (search) => search.p, })) as unknown as IReadRequest;
  const opts = {
    pagination: { ...urlPagination },
    query: { ...urlQuery, userId: user?.id ?? "", },
  };

  const { data, isPending, isError, error }: UseQueryResult<IFilterReadResponse> = useViewFilterQuery(opts);
  const filters = data?.filters ?? [];
  const paginationObj = data?.pagination ? data.pagination : urlPagination ? urlPagination : DefaultPagination;
  const pagination = new Pagination(paginationObj);

  const pageChange = useCallback((event: MouseEvent<HTMLButtonElement> | null, value: number) => {
    if (event) { event.stopPropagation() };
    pagination.changePage(value);
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        const dPrev = decodeState(prev.p) as unknown as IReadRequest;
        return { ...prev, p: encodeState({ ...dPrev, pagination: pagination.paging }) }
      }
    });
  }, [opts]);

  const pageSizeChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    pagination.changeSize(e.target.value);
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        const dPrev = decodeState(prev.p) as unknown as IReadRequest;
        return { ...prev, p: encodeState({ ...dPrev, pagination: pagination.paging }) }
      }
    });
  }, [opts]);

  const pageSortChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    pagination.changeSort(e.target.value);
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        const dPrev = decodeState(prev.p) as unknown as IReadRequest;
        return { ...prev, p: encodeState({ ...dPrev, pagination: pagination.paging }) }
      }
    });
  }, [opts]);

  const viewItemsClick = useCallback((idx: number) => {
    const it = filters[idx];
    storeSetFilterScroll(idx);
    storeSetItemScroll(0);
    const c = encodeState({
      query: { ...DefaultReadQuery, userId: opts.query.userId, tags: [...it.tags] },
      pagination: { ...DefaultPagination, size: pagination.paging.size },
      name: it.name, parent: "/filters", flag: true,
    });
    navigate({
      // @ts-ignore
      to: "/items", search: (prev: IUrlSearch) => { return { ...prev, c } }
    });
  }, [opts]);

  const editFilterClick = useCallback((idx: number) => {
    const it = filters[idx];
    storeSetFilterScroll(idx);
    storeSetItemScroll(0);
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        return {
          ...prev, e: encodeState({ obj: it, flag: true, modal: "filter" })
        }
      }
    });
  }, [opts]);


  const contextValue = useMemo(() => ({
    filters,
    pagination,
    isPending,
    isError,
    error,
    pageChange,
    pageSizeChange,
    pageSortChange,
    viewItemsClick,
    editFilterClick,
  } as unknown as IViewFiltersContext), [opts]);


  return <ViewFiltersContext.Provider value={contextValue}>
    {children}
  </ViewFiltersContext.Provider>
}
