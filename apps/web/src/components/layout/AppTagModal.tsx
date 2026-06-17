
import {
  useRef,
  useCallback,
  useMemo,
  createContext,
} from 'react';
import type {
  ReactNode,
} from 'react';
import {
  useForm,
  useStore,
} from "@tanstack/react-form";
import {
  useUser
} from '@clerk/react';
import Stack from '@mui/material/Stack';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import RestartIcon from '@iconify-react/mdi/restart';
import RestartOffIcon from '@iconify-react/mdi/restart-off';
import SaveIcon from '@iconify-react/material-symbols/save';
import SaveOffIcon from '@iconify-react/lucide/save-off';
import DeleteIcon from '@iconify-react/mdi/delete';
import DeleteOffIcon from '@iconify-react/mdi/delete-off';
import HourglassOutlineIcon from '@iconify-react/material-symbols/hourglass-outline';





// Internal imports
import {
  useAppStore,
  type TAppStore
} from '@/hooks/store/boundStore';
import {
  DefaultTag
} from '@/utils/defaults';
import type {
  ITag,
} from "@/domain/entities/tag";
import {
  ItemFormSpeedDialBox,
} from "@/components/core/AppBox";
import { useUpdateTag } from "@/hooks/queries/tag";
import { SimpleTextField } from "@/components/layout/SimpleTextField";
import { FormDialog } from "@/components/layout/FormDialog";
import { SimpleArrayTextField } from "./SimpleArrayTextField";
import {
  prepTagUpdate,
  formValidator,
} from "@/domain/rules";


type itemFields = "id" | "userId" | "name" | `props[${number}]`

export function AppTagModal({ itemTag }: { itemTag?: ITag }): ReactNode {
  const store: TAppStore = useAppStore((state) => state);
  const formTag: ITag = itemTag ? itemTag : DefaultTag;
  const { user } = useUser();
  const mutation = useUpdateTag();
  const formSubmission = ({ value }: { value: ITag }) => {
    const submitValue = prepTagUpdate({ value, userId: user?.id ?? "" });
    mutation.mutate(submitValue);
  };

  const handleDelete = () => {
    form.setFieldValue('softDelete', true);
    form.handleSubmit();
  };

  const form = useForm({
    defaultValues: { ...formTag },
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: ITag }) {
        return formValidator({ value });
      },
      onBlur({ value }: { value: ITag }) {
        return formValidator({ value });
      },
    },
  });

  const formErrorMap = useStore(form.store, (state) => state.errorMap);
  const formErrors = useStore(form.store, (state) => state.errors);
  const formCanSubmit = formErrors.length == 0;
  const formIsSubmitted = useStore(form.store, (state) => state.isSubmitted);
  const formIsDirty = useStore(form.store, (state) => state.isDirty);
  const formStateId = useStore(form.store, (state) => state.values.id);
  const openBackdrop = useRef(false);
  if (mutation.isSuccess) {
    openBackdrop.current = false;
  } else {
    openBackdrop.current = formIsSubmitted;
  }



  function closeModal() {
    store.setTagModal(false);
    store.setDisplayTag(undefined);
  }

  const fields: itemFields[] = ['name'];

  // key, form, legend, addValueHeader
  const propsProps = {
    keyName: "props",
    form,
    legend: "properties",
    addValueHeader: "Click here to add a new property",
  }
  const formContent = (
    <Box component="section" >
      <Stack spacing={0} sx={{ width: '100%' }} >
        {fields.map((fds: itemFields) => < SimpleTextField keyName={fds} form={form} />)}
        <SimpleArrayTextField {...propsProps} />
      </Stack>
    </Box>
  )

  const dummyAction = () => undefined;

  const canDelete = !formIsSubmitted && formStateId !== "";
  const saveIcon = formIsSubmitted ? <HourglassOutlineIcon height="1.5rem" /> :
    formCanSubmit ? <SaveIcon height="1.5rem" /> : <SaveOffIcon height="1.5rem" />
  const formActions = (
    <ItemFormSpeedDialBox>
      <SpeedDial ariaLabel="SpeedDial basic example"
        icon={<SpeedDialIcon />} >
        <SpeedDialAction
          key={"delete"}
          icon={canDelete ? <DeleteIcon height="1.5rem" /> : <DeleteOffIcon height="1.5rem" />}
          // @ts-ignore
          onClick={canDelete ? handleDelete : dummyAction}
          slotProps={{
            tooltip: { title: formCanSubmit ? "save" : "cannot save changes", },
          }}
        />

        <SpeedDialAction
          key={"save"}
          icon={saveIcon}
          // @ts-ignore
          onClick={formCanSubmit ? form.handleSubmit : dummyAction}
          slotProps={{
            tooltip: { title: formCanSubmit ? "save" : "cannot save changes", },
          }}
        />

        <SpeedDialAction
          key={formIsDirty ? "reset" : "No changes yet"}
          icon={formIsDirty ? <RestartIcon height="1.5rem" /> : <RestartOffIcon height="1.5rem" />}
          // @ts-ignore
          onClick={formIsDirty ? form.reset : dummyAction}
          slotProps={{
            tooltip: { title: formIsDirty ? "reset" : "no changes yet", },
          }}
        />
      </SpeedDial>
    </ItemFormSpeedDialBox>
  );

  const props = {
    title: formTag.id == "" ? "Add new tag" : "Update tag",
    content: formContent,
    actions: formActions,
    formWarning: formErrorMap.onChange,
    openDialog: store.tagModal,
    showBackDrop: openBackdrop.current,
    closeDialog: closeModal,
    form,
    mutation,
  }
  return (
    <FormDialog {...props} />
  )
};
