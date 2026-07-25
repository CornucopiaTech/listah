
import {
  useMemo,
} from 'react';
import type {
  ReactNode,
} from 'react';
import { useUser } from '@clerk/react';
import {
  useForm,
} from "@tanstack/react-form";
import {
  useNavigate,
  getRouteApi,
} from '@tanstack/react-router';
import {
  type UseQueryResult,
} from '@tanstack/react-query';




// Internal imports
import type {
  IFilter,
  IFilterUpdateContext,
  IUrlSearch,
  IEditor,
  IFilterForm,
  ITagReadResponse,
  ITag,
} from "@/domain/entities";
import {
  DefaultFilter,
  DefaultEditor,
  DefaultReadRequest,
  DefaultReadQuery,
  DefaultPagination,
} from '@/domain/entities';
import {
  useUpdateFilter,
} from './queries';
import {
  FilterUpdateContext
} from './useFilter';
import {
  prepFilterUpdate,
  filterFormValidator,
} from "@/domain/rules";
import {
  encodeState,
  decodeState
} from '@/helpers/encoders';
import {
  useListTag,
} from "@/hooks/context";




export function FilterUpdateProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const routeApi = getRouteApi("/filters");
  const { obj, flag, modal } = decodeState(routeApi.useSearch({ select: (search) => search.e, })) as unknown as IEditor;
  const formFilter = obj ? obj as unknown as IFilter : DefaultFilter;
  const title = formFilter.id == "" ? "Add new filter" : "Update filter";

  const openDialog = flag && modal && modal == "filter" ? flag : false;
  const closeDialog = () => {
    form.reset();
    mutation.reset();
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => { return { ...prev, e: encodeState(DefaultEditor) } }
    });
  };
  const tagQuery = {
    ...DefaultReadRequest,
    query: { ...DefaultReadQuery, userId: user?.id || "" },
    pagination: { ...DefaultPagination, pageSize: -1, }
  }
  const {
    isPending, data, error
  }: UseQueryResult<ITagReadResponse> = useListTag(tagQuery);
  const tags = data?.tags ?? [];

  const existingTags = formFilter ? new Set([...formFilter.tags]) : new Set([]);


  let formData: IFilterForm = {
    name: formFilter?.name ?? "",
    id: formFilter?.id ?? "",
    tags: [],
    softDelete: false,
  };

  tags.forEach((item: ITag) => {
    if (existingTags.has(item.id)) {
      formData.tags = [...formData.tags, { id: item.id, name: item.name, checked: true }];
    } else {
      formData.tags = [...formData.tags, { id: item.id, name: item.name, checked: false }];
    }
  });

  formData.tags = formData.tags.sort((a, b) => +b.checked - +a.checked);

  const mutation = useUpdateFilter();
  function formSubmission({ value }: { value: IFilterForm }): void {
    const submitValue = prepFilterUpdate({ value, userId: user?.id || "" });
    mutation.mutate(submitValue);
    if (mutation.isSuccess) {
      closeDialog();
    }
  }
  const form = useForm({
    defaultValues: formData,
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: IFilterForm }) {
        return filterFormValidator({ value });
      },
      onBlur({ value }: { value: IFilterForm }) {
        return filterFormValidator({ value });
      },
    },
  });


  const contextValue = useMemo(() => ({
    openDialog,
    closeDialog,
    mutation,
    form,
    title,
    formData,
    isPending,
    error,
    tags,
  } as unknown as IFilterUpdateContext),
    [obj, flag, modal]
  );

  return <FilterUpdateContext.Provider value={contextValue}>
    {children}
  </FilterUpdateContext.Provider>
}
