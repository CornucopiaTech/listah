

import type {
  ReactNode,
} from 'react';
import {
  useStore,
} from "@tanstack/react-form";
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
  ItemFormSpeedDialBox,
} from "@/components/core/AppBox";
import { SimpleTextField } from "@/components/layout/SimpleTextField";
import { FormDialog } from "@/components/layout/FormDialog";
import { SimpleArrayTextField } from "./SimpleArrayTextField";
import { useFormContext } from '@/hooks/services/useForm';


type itemFields = "id" | "userId" | "name" | `props[${number}]`

export function AppTagModal(): ReactNode {
  const store: TAppStore = useAppStore((state) => state);
  const { form, } = useFormContext();
  const canSubmit = useStore(form.store, (state) => state.errors).length == 0;
  const isSubmitted = useStore(form.store, (state) => state.isSubmitted);
  const isDirty = useStore(form.store, (state) => state.isDirty);
  const id = useStore(form.store, (state) => state.values.id);
  const canDelete = isSubmitted && id !== "";
  const handleDelete = () => {
    form.setFieldValue('softDelete', true);
    form.handleSubmit();
  };



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

  const saveIcon = isSubmitted ? <HourglassOutlineIcon height="1.5rem" /> :
    canSubmit ? <SaveIcon height="1.5rem" /> : <SaveOffIcon height="1.5rem" />
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
            tooltip: { title: canSubmit ? "save" : "cannot save changes", },
          }}
        />

        <SpeedDialAction
          key={"save"}
          icon={saveIcon}
          // @ts-ignore
          onClick={canSubmit ? form.handleSubmit : dummyAction}
          slotProps={{
            tooltip: { title: canSubmit ? "save" : "cannot save changes", },
          }}
        />

        <SpeedDialAction
          key={isDirty ? "reset" : "No changes yet"}
          icon={isDirty ? <RestartIcon height="1.5rem" /> : <RestartOffIcon height="1.5rem" />}
          // @ts-ignore
          onClick={isDirty ? form.reset : dummyAction}
          slotProps={{
            tooltip: { title: isDirty ? "reset" : "no changes yet", },
          }}
        />
      </SpeedDial>
    </ItemFormSpeedDialBox>
  );

  const props = {
    title: id == "" ? "Add new tag" : "Update tag",
    content: formContent,
    actions: formActions,
    openDialog: store.tagModal,
    closeDialog: closeModal,
  }
  return (
    <FormDialog {...props} />
  )
};
