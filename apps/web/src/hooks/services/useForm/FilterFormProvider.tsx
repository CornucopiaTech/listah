
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
  prepFilterUpdate,
  filterFormValidator,
} from "@/domain/rules";
import {
  useUpdateFilter
} from "@/hooks/queries";
import {
  FormContext,
  useFormDataContext,
} from "@/hooks/services/useForm/useForm";
import type {
  IFilterForm,
  IFormDataContext,
} from '@/domain/entities';

// IFormDataContext




export function FilterFormProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const mutation = useUpdateFilter();
  const { formData } = useFormDataContext() as unknown as IFormDataContext;

  function formSubmission({ value }: { value: IFilterForm }): void {
    const submitValue = prepFilterUpdate({ value, userId: user?.id || "" });
    mutation.mutate(submitValue);
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

  return <FormContext.Provider value={{ form, mutation }}>
    {children}
  </FormContext.Provider>
}
