
import type {
  ReactNode,
} from 'react';
import {
  type UseQueryResult,
} from '@tanstack/react-query';
import { useUser } from '@clerk/react';
import {
  useForm,
} from "@tanstack/react-form";




// Internal imports
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import type {
  ITag,
  ITagUpdateContext,
  ITagReadResponse,
  IReadRequest,
} from "@/domain/entities";
import {
  DefaultTag,
} from '@/domain/entities';
import {
  useListTag,
  useUpdateTag,
} from './queries';
import {
  TagUpdateContext
} from './useTag';
import {
  getRouteSearch,
} from "@/utils/routing";
import {
  prepTagUpdate,
  tagFormValidator,
} from "@/domain/rules";
import {
  validateName,
} from "@/domain/rules/fieldLength";



export function TagUpdateProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const storeSetTagModal = useAppStore((state) => state.setTagModal);
  const storeTagModal = useAppStore((state) => state.tagModal);

  // Get route params
  const search = getRouteSearch("/tags") as unknown as IReadRequest;
  const opts = {
    ...search,
    query: { ...search.query, userId: user?.id ?? "", },
  };
  const { editor, query, pagination } = opts;

  const { data, isPending, error, }: UseQueryResult<ITagReadResponse> = useListTag({ query, pagination });
  const tags = data?.tags ?? [];

  const editorId = editor && editor.flag ? editor.tag : ""
  const tagVal = tags.filter((i: ITag) => i.id == editorId)
  const tag = tagVal.length > 0 ? tagVal[0] : DefaultTag;

  const title = tag.id == "" ? "Add new tag" : "Update tag";

  const mutation = useUpdateTag();
  const formSubmission = ({ value }: { value: ITag }) => {
    const submitValue = prepTagUpdate({ value, userId: user?.id || "" });
    mutation.mutate(submitValue);
    if (mutation.isSuccess) {

    }
  };

  const form = useForm({
    defaultValues: { ...tag },
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: ITag }) {
        return tagFormValidator({ value });
      },
      onBlur({ value }: { value: ITag }) {
        return tagFormValidator({ value });
      },
    },
  });

  function exitUpdate() {
    storeSetTagModal(false);
  }
  const validator = {
    onChange: ({ value }: { value: any }) => validateName(value as unknown as string),
    onBlur: ({ value }: { value: any }) => validateName(value as unknown as string),
  }
  const beginUpdate = storeTagModal;



  const contextValue = {
    title,
    isPending,
    error,
    form,
    mutation,
    validator,
    beginUpdate,
    exitUpdate,
  } as unknown as ITagUpdateContext;

  return <TagUpdateContext.Provider value={contextValue}>
    {children}
  </TagUpdateContext.Provider>
}
