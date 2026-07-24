
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
  IUrlSearch,
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
  encodeState,
  decodeState
} from '@/helpers/encoders';


export function TagListProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const storeSetTagScroll = useAppStore((state) => state.setTagScroll);
  const storeSetItemScroll = useAppStore((state) => state.setItemScroll);
  const navigate = useNavigate();
  const routeApi = getRouteApi("/tags");
  const { query: urlQuery, pagination: urlPagination } = decodeState(routeApi.useSearch({ select: (search) => search.p, })) as unknown as IReadRequest;
  const opts = {
    pagination: { ...urlPagination },
    query: { ...urlQuery, userId: user?.id ?? "", },
  };

  const { data, isPending, isError, error, }: UseQueryResult<ITagReadResponse> = useListTag(opts);
  const tags = data?.tags ?? [];
  const paginationObj = data?.pagination ? data.pagination : urlPagination ? urlPagination : DefaultPagination;
  const pagination = new Pagination(paginationObj);

  const storeSetSuccessMsg = useAppStore((state) => state.setSuccessMsg);
  const storeSetWarnMsg = useAppStore((state) => state.setWarnMsg);
  const storeSetErrorMsg = useAppStore((state) => state.setErrorMsg);

  const resetMsg = () => {
    console.info("Resetting Msg from List provider")
    storeSetSuccessMsg(undefined);
    storeSetWarnMsg(undefined);
    storeSetErrorMsg(undefined);
  }


  const pageChange = useCallback((event: MouseEvent<HTMLButtonElement> | null, value: number) => {
    if (event) { event.stopPropagation() };
    pagination.changePage(value);
    navigate({
      to: ".",
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
      search: (prev: IUrlSearch) => {
        const dPrev = decodeState(prev.p) as unknown as IReadRequest;
        return { ...prev, p: encodeState({ ...dPrev, pagination: pagination.paging }) }
      }
    });
  }, [opts]);

  const listItemClick = useCallback((idx: number) => {
    const it = tags[idx];
    storeSetTagScroll(idx);
    storeSetItemScroll(0);
    const c = encodeState({
      query: { ...DefaultReadQuery, userId: opts.query.userId, tags: [it.id] },
      pagination: { ...DefaultPagination, size: pagination.paging.size },
      id: it.id, name: it.name,
    });
    navigate({
      to: ".", search: (prev: IUrlSearch) => { return { ...prev, c } }
    });
  }, [opts]);

  const viewItemsClick = useCallback((idx: number) => {
    const it = tags[idx];
    storeSetTagScroll(idx);
    storeSetItemScroll(0);
    const c = encodeState({
      query: { ...DefaultReadQuery, userId: opts.query.userId, tags: [it.id] },
      pagination: { ...DefaultPagination, size: pagination.paging.size },
      id: it.id, name: it.name,
    });
    navigate({
      to: ".", search: (prev: IUrlSearch) => { return { ...prev, c } }
    });
  }, [opts]);

  const editTagClick = useCallback((idx: number) => {
    const it = tags[idx];
    storeSetTagScroll(idx);
    storeSetItemScroll(0);
    resetMsg();
    navigate({
      to: ".",
      search: (prev: IUrlSearch) => {
        return {
          ...prev, e: encodeState({ obj: it, flag: true, modal: "tag" })
        }
      }
    });
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
    viewItemsClick,
    editTagClick,
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
      viewItemsClick,
      editTagClick,
    ]
  );

  return <TagListContext.Provider value={contextValue}> {children} </TagListContext.Provider>
}
