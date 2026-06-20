
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
  IItemForm,
  IFormDataContext,
} from "@/domain/entities";
import {
  prepItemUpdate,
  validateItemTags,
  validateName,
} from "@/domain/rules";
import {
  useUpdateItem
} from "@/hooks/queries";
import {
  FormContext,
  useFormDataContext
} from '@/hooks/services/useForm/useForm';




// ToDo: Update query cache when mutation succeeeds
export function ItemFormProvider({ children }: { children: ReactNode, }) {
  const { formData } = useFormDataContext() as unknown as IFormDataContext;
  const { data, knownTags } = formData;
  const { user } = useUser();
  const mutation = useUpdateItem();
  const formSubmission = ({ value }: { value: IItemForm }) => {
    const submitValue = prepItemUpdate({ value, userId: user?.id || "" });
    mutation.mutate(submitValue);
  };

  function formValidator({ value }: { value: IItemForm }) {
    const invalidName = validateName(value.name as string);
    if (invalidName) {
      return invalidName;
    }

    const invalidTag = validateItemTags(value.tags, knownTags.current);
    if (invalidTag) {
      return invalidTag
    }
    return undefined;
  }


  // @ts-ignore
  const form = useForm<IItemForm>({
    defaultValues: data,
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: IItemForm }) {
        return formValidator({ value });
      },
      onBlur({ value }: { value: IItemForm }) {
        return formValidator({ value });
      },
    },
  });


  return <FormContext.Provider value={{ form, mutation }}>
    {children}
  </FormContext.Provider>
}
