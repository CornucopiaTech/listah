
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
  IFilterForm,
} from "@/domain/entities";
import {
  DefaultFilter,
  DefaultReadRequest,
  DefaultReadQuery,
  DefaultPagination,
} from '@/domain/entities';
import {
  useListTag
} from '@/hooks/queries';
import {
  FormDataContext
} from './useForm';



export function FilterFormDataProvider({ children, displayFilter, }: { children: ReactNode, displayFilter?: IFilter }) {
  const { user } = useUser();
  const formFilter = displayFilter ? displayFilter : DefaultFilter;
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

  return <FormDataContext.Provider value={{ isPending, isError, data, formData, error }}>
    {children}
  </FormDataContext.Provider>
}
