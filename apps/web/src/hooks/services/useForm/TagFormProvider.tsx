
import type {
  ReactNode,
} from 'react';
import {
  useForm,
} from "@tanstack/react-form";
import {
  useUser
} from '@clerk/react';


import type {
  ITag,
  IFormDataContext,
} from "@/domain/entities";
import {
  prepTagUpdate,
  tagFormValidator,
} from "@/domain/rules";
import {
  useUpdateTag
} from "@/hooks/queries/tag";
import {
  FormContext,
  useFormDataContext
} from '@/hooks/services/useForm/useForm';


export function TagFormProvider({ children }: { children: ReactNode, }) {
  const { formData } = useFormDataContext() as unknown as IFormDataContext;
  const { user } = useUser();
  const mutation = useUpdateTag();
  const formSubmission = ({ value }: { value: ITag }) => {
    const submitValue = prepTagUpdate({ value, userId: user?.id || "" });
    mutation.mutate(submitValue);
  };

  const form = useForm({
    defaultValues: { ...formData },
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
