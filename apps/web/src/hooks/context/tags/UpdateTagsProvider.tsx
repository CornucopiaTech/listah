
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





// Internal imports
import type {
  ITag,
  IUpdateTagsContext,
  IUrlSearch,
  IEditor,
} from "@/app-types";
import {
  DefaultTag,
  DefaultEditor,
} from '@/app-types';
import {
  useUpdateTagsQuery,
} from './queries';
import {
  UpdateTagsContext
} from './useTag';
import {
  prepTagUpdate,
  tagFormValidator,
} from "@/domain/rules";
import {
  encodeState,
  decodeState
} from '@/helpers/encoders';




export function UpdateTagsProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const routeApi = getRouteApi("/tags");
  const { obj, flag, modal } = decodeState(routeApi.useSearch({ select: (search) => search.e, })) as unknown as IEditor;
  const defaultValue = obj ?? DefaultTag;
  const title = defaultValue.id == "" ? "Add new tag" : "Update tag";

  const openDialog = flag && modal && modal == "tag" ? flag : false;
  const closeDialog = () => {
    form.reset();
    mutation.reset();
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => { return { ...prev, e: encodeState(DefaultEditor) } }
    });
  };

  const mutation = useUpdateTagsQuery();
  const formSubmission = ({ value }: { value: any }) => {
    const submitValue = prepTagUpdate({ value, userId: user?.id || "" });
    mutation.mutate([submitValue]);
    if (mutation.isSuccess) {
      closeDialog();
    }
  };
  const form = useForm({
    defaultValues: { ...defaultValue },
    onSubmit: formSubmission,
    validators: {
      // @ts-ignore
      onChange({ value }: { value: ITag }) {
        return tagFormValidator({ value });
      },
      // @ts-ignore
      onBlur({ value }: { value: ITag }) {
        return tagFormValidator({ value });
      },
    },
  });



  const contextValue = useMemo(() => ({
    openDialog,
    closeDialog,
    mutation,
    form,
    title,
  } as unknown as IUpdateTagsContext),
    [obj, flag, modal]
  );

  return <UpdateTagsContext.Provider value={contextValue}>
    {children}
  </UpdateTagsContext.Provider>
}
