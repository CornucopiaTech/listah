
import type {
  ReactNode,
} from 'react';
import {
  type UseSuspenseQueryResult,
} from '@tanstack/react-query';
import { useUser } from '@clerk/react';

// Internal imports


import type {
  ITag,
  ITagReadResponse,
  IFilter,
  IFilterReadResponse,
  IFilterForm,
} from "@/domain/entities";
import {
  DefaultFilter,
  DefaultReadRequest,
  DefaultReadQuery,
  DefaultPagination,
} from '@/domain/entities';
import {
  useListTag,
  useListFilter
} from '@/hooks/queries';
import {
  FormDataContext
} from './useForm';



export function FilterFormDataProvider({ children, displayFilter, }: { children: ReactNode, displayFilter?: IFilter }) {
  const { user } = useUser();
  let formFilter = DefaultFilter;

  if (displayFilter) {
    const { user } = useUser();
    const tagQuery = {
      ...DefaultReadRequest,
      query: { ...DefaultReadQuery, userId: user?.id ?? "", filter: { tags: [...displayFilter.tags] } },
      pagination: { ...DefaultPagination, pageSize: -1, }
    }
    const { data: filterData, }: UseSuspenseQueryResult<IFilterReadResponse> = useListFilter(tagQuery);

    // Todo: Remove the ability for filters page to create tags. That way, the only route that can be calling tags page is /tags or /items
    const filters = filterData?.filters?.filter(
      (i: IFilter) => i.id === displayFilter.id
    ) ?? [];
    if (filters.length > 0) {
      formFilter = filters[0];
    }
  }



  // The scrollable element for your list
  const tagQuery = {
    ...DefaultReadRequest,
    query: { ...DefaultReadQuery, userId: user?.id || "" },
    pagination: { ...DefaultPagination, pageSize: -1, }
  }
  const {
    isPending, isError, data, error
  }: UseSuspenseQueryResult<ITagReadResponse> = useListTag(tagQuery);


  const tagCategories: ITag[] = data && data.tags ? data.tags : [];
  const existingTags = formFilter ? new Set([...formFilter.tags]) : new Set([]);


  let formData: IFilterForm = {
    name: formFilter?.name ?? "",
    id: formFilter?.id ?? "",
    tags: [],
    softDelete: false,
  };

  tagCategories.forEach((item: ITag) => {
    if (existingTags.has(item.id)) {
      formData.tags = [...formData.tags, { id: item.id, name: item.name, checked: true }];
    } else {
      formData.tags = [...formData.tags, { id: item.id, name: item.name, checked: false }];
    }
  });

  return <FormDataContext.Provider value={{
    isPending, isError, data, formData, error
  }}>
    {children}
  </FormDataContext.Provider>
}
