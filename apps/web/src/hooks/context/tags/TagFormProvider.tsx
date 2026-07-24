
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
  ITagFormContext,
  IUrlSearch,
  IEditor,
} from "@/domain/entities";
import {
  DefaultTag,
  DefaultEditor,
} from '@/domain/entities';
import {
  useUpdateTag,
} from './queries';
import {
  TagUpdateContext
} from './useTag';
import {
  prepTagUpdate,
  tagFormValidator,
} from "@/domain/rules";
import {
  encodeState,
  decodeState
} from '@/helpers/encoders';




export function TagFormProvider({ children }: { children: ReactNode }) {
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
      search: (prev: IUrlSearch) => { return { ...prev, e: encodeState(DefaultEditor) } }
    });
  };

  const mutation = useUpdateTag();
  const formSubmission = ({ value }: { value: any }) => {
    const submitValue = prepTagUpdate({ value, userId: user?.id || "" });
    mutation.mutate(submitValue);
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
  } as unknown as ITagFormContext),
    [obj, flag, modal]
  );

  return <TagUpdateContext.Provider value={contextValue}>
    {children}
  </TagUpdateContext.Provider>
}
