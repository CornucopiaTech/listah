
import type {
  ReactNode,
} from 'react';
import { useUser } from '@clerk/react';
import type {
  UseSuspenseQueryResult,
} from '@tanstack/react-query';


// Internal imports
import type {
  IFilter,
} from "@/domain/entities";
import {
  DefaultTag,
} from '@/domain/entities';
import {
  FormDataContext
} from './useForm';
import {
  DefaultReadRequest,
  DefaultPagination,
  DefaultReadQuery,
} from '@/domain/entities';
import type {
  ITag,
  ITagReadResponse,
} from '@/domain/entities';
import {
  useListTag
} from "@/hooks/queries/tag";
import {
  getRouteContext,
  getRouteLoaderData,
} from "@/utils/routing";



export function PrevTagFormDataProvider({ children, displayTag, }: { children: ReactNode, displayTag?: IFilter }) {
  let qformData = DefaultTag;
  let qisPending = false;
  let qisError = false;
  let qdata = DefaultTag;
  let qerror = null;

  if (displayTag) {
    // const { user } = useUser();
    // const tagQuery = {
    //   ...DefaultReadRequest,
    //   query: { ...DefaultReadQuery, userId: user?.id || "" },
    //   pagination: { ...DefaultPagination, pageSize: -1, }
    // }
    // const {
    //   isPending, isError, data, error
    // }: UseSuspenseQueryResult<ITagReadResponse> = useListTag(tagQuery);

    // Todo: Remove the ability for filters page to create tags. That way, the only route that can be calling tags page is /tags or /items
    let qKey;

    const { query: tagQuery, pagination: tagPagination } = getRouteContext("/tags");
    const { query: itemQuery, pagination: itemPagination } = getRouteContext("/items");
    const { query: filterQuery, pagination: filterPagination } = getRouteContext("/filters");
    if (tagQuery && tagPagination) {
      qKey = { query: tagQuery, pagination: tagPagination }
    } else if (itemQuery && itemPagination) {
      qKey = { query: itemQuery, pagination: itemPagination }
    } else {
      qKey = { query: filterQuery, pagination: filterPagination }
    }
    console.info('Error Route Context qkey - ', qKey)
    const {
      isPending, isError, data, error
    }: UseSuspenseQueryResult<ITagReadResponse> = useListTag(qKey);

    qisPending = isPending;
    qisError = isError;
    qerror = error;
    const tags = data?.tags?.filter((i: ITag) => i.id === displayTag.id) ?? [];
    if (tags.length > 0) {
      qformData = tags[0];
      qdata = tags[0];
    }
  }


  return <FormDataContext.Provider value={{
    isPending: qisPending,
    isError: qisError,
    data: qdata,
    formData: qformData,
    error: qerror,
  }}>
    {children}
  </FormDataContext.Provider>
}


export function AggressiveTagFormDataProvider({ children, displayTag, }: { children: ReactNode, displayTag?: IFilter }) {
  let qformData = DefaultTag;
  let qisPending = false;
  let qisError = false;
  let qdata = DefaultTag;
  let qerror = null;

  if (displayTag) {
    // Todo: Remove the ability for filters page to create tags. That way, the only route that can be calling tags page is /tags or /items
    const loaderData = getRouteLoaderData("__root__");
    console.info('loaderData', loaderData)
    return loaderData.tags.then((data: ITagReadResponse) => {
      console.info('data', data)
      const tags = data?.tags?.filter((i: ITag) => i.id === displayTag.id) ?? [];
      console.info('tags', tags)
      if (tags.length > 0) {
        qformData = tags[0];
        qdata = tags[0];
      }
      return <FormDataContext.Provider value={{
        isPending: qisPending,
        isError: qisError,
        data: qdata,
        formData: qformData,
        error: qerror,
      }}>
        {children}
      </FormDataContext.Provider>
    })
  }


  return <FormDataContext.Provider value={{
    isPending: qisPending,
    isError: qisError,
    data: qdata,
    formData: qformData,
    error: qerror,
  }}>
    {children}
  </FormDataContext.Provider>
}


export function TagFormDataProvider({ children, displayTag, }: { children: ReactNode, displayTag?: IFilter }) {
  let qformData = DefaultTag;
  let qisPending = false;
  let qisError = false;
  let qdata = DefaultTag;
  let qerror = null;


  if (displayTag) {
    const { user } = useUser();
    const tagQuery = {
      ...DefaultReadRequest,
      query: { ...DefaultReadQuery, userId: user?.id ?? "", filter: { tags: [displayTag.id] } },
      pagination: { ...DefaultPagination, pageSize: -1, }
    }
    const {
      isPending, isError, data, error
    }: UseSuspenseQueryResult<ITagReadResponse> = useListTag(tagQuery);

    // Todo: Remove the ability for filters page to create tags. That way, the only route that can be calling tags page is /tags or /items
    qisPending = isPending;
    qisError = isError;
    qerror = error;
    const tags = data?.tags?.filter((i: ITag) => i.id === displayTag.id) ?? [];
    if (tags.length > 0) {
      qformData = tags[0];
      qdata = tags[0];
    }
  }


  return <FormDataContext.Provider value={{
    isPending: qisPending,
    isError: qisError,
    data: qdata,
    formData: qformData,
    error: qerror,
  }}>
    {children}
  </FormDataContext.Provider>
}
