
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
  IViewItemsContext,
  IChildReadRequest,
  IUrlSearch,
  IItemReadResponse,
  IItem,
} from "@/app-types";
import {
  DefaultPagination,
  Pagination,
} from '@/app-types';
import {
  encodeState,
  decodeState,
} from '@/helpers/encoders';
import {
  useViewItemQuery,
  ViewItemsContext,
} from "@/hooks/context/items";
import {
  useUpdateItemsQuery,
} from './queries';


export function ViewItemsProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const storeSetItemScroll = useAppStore((state) => state.setItemScroll);

  const itemsChecked = useAppStore((state) => state.itemsChecked);
  const setItemsChecked = useAppStore((state) => state.setItemsChecked);
  const setAllItemsChecked = useAppStore((state) => state.setAllItemsChecked);
  const allItemsChecked = useAppStore((state) => state.allItemsChecked);
  const mutation = useUpdateItemsQuery();

  const navigate = useNavigate();
  // @ts-ignore
  const routeApi = getRouteApi("/items");
  // @ts-ignore
  const { query: urlQuery, pagination: urlPagination } = decodeState(routeApi.useSearch({ select: (search) => search.c, })) as unknown as IChildReadRequest;
  const opts = {
    pagination: { ...urlPagination },
    query: { ...urlQuery, userId: user?.id ?? "", },
  };
  const {
    data, isPending, isError, error
  }: UseQueryResult<IItemReadResponse> = useViewItemQuery(opts);

  const serveritems = data?.items ?? [];
  const items = serveritems.map(
    (v: IItem) => ({ ...v, tempUpdatedAt: new Date(v.updatedAt) })
  ).map(
    (v: IItem) => ({
      ...v,
      updatedAt: `${v.tempUpdatedAt?.getFullYear()}-${String(v.tempUpdatedAt?.getMonth()).padStart(2, '0')}-${String(v.tempUpdatedAt?.getDay()).padStart(2, '0')}`
    })
  );

  const paginationObj = data?.pagination ? data.pagination : opts?.pagination ? opts.pagination : DefaultPagination;
  const pagination = new Pagination(paginationObj);

  const pageSizeChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation()
    pagination.changeSize(e.target.value);
    setAllItemsChecked(false);
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        const dPrev = decodeState(prev.c) as unknown as IChildReadRequest;
        return { ...prev, c: encodeState({ ...dPrev, pagination: pagination.paging }) }
      }
    });
  }, [opts]);

  const pageSortChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation()
    pagination.changeSort(e.target.value);
    setAllItemsChecked(false);
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
    setAllItemsChecked(false);
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

  const check = useCallback((checkedId: string) => {
    // If id is already checked, uncheck it. Otherwise, check it.
    const newChecked = itemsChecked.has(checkedId) ?
      itemsChecked.difference(new Set([checkedId])) :
      itemsChecked.union(new Set([checkedId]))
    setItemsChecked(newChecked);
  }, [opts]);

  const toggleSelectAll = useCallback(() => {
    setAllItemsChecked(!allItemsChecked);
  }, [opts]);

  const bulkDelete = useCallback(() => {
    let deleted = items.filter(
      (val: IItem) => allItemsChecked ? true : itemsChecked.has(val.id)
    ).map(
      (val: IItem) => ({ ...val, softDelete: true, updatedAt: val.tempUpdatedAt?.toJSON() || "" })
    );

    mutation.mutate(deleted, {
      onSuccess: () => {
        pagination.resetPaging();
        console.info({ pagination: pagination.paging });
        setItemsChecked(new Set());
        setAllItemsChecked(false);
        navigate({
          to: ".",
          // @ts-ignore
          search: (prev: IUrlSearch) => {
            const dPrev = decodeState(prev.c) as unknown as IChildReadRequest;
            return { ...prev, c: encodeState({ ...dPrev, pagination: pagination.paging }) }
          }
        });
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
    pageSortChange,
    editItemClick,
    check,
    toggleSelectAll,
    bulkDelete,
  } as unknown as IViewItemsContext), [opts]);
  return <ViewItemsContext.Provider value={contextValue}> {children} </ViewItemsContext.Provider>
}
