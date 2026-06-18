
import type {
  ReactNode,
} from 'react';
import {
  useForm,
} from "@tanstack/react-form";
import {
  useUser
} from '@clerk/react';


import {
  DefaultTag
} from "@/domain/entities/tag";
import type {
  ITag,
} from "@/domain/entities/tag";
import {
  prepTagUpdate,
  tagFormValidator,
} from "@/domain/rules";
import {
  useUpdateTag
} from "@/hooks/queries/tag";
import { FormContext } from "@/hooks/services/useForm/useForm";



export function TagFormProvider({ children, displayTag }: { children: ReactNode, displayTag?: ITag }) {
  const formTag: ITag = displayTag ? displayTag : DefaultTag;
  const { user } = useUser();
  const mutation = useUpdateTag();
  const formSubmission = ({ value }: { value: ITag }) => {
    const submitValue = prepTagUpdate({ value, userId: user?.id || "" });
    mutation.mutate(submitValue);
  };

  const form = useForm({
    defaultValues: { ...formTag },
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

  return <FormContext.Provider value={{ form, mutation }}>
    {children}
  </FormContext.Provider>
}
