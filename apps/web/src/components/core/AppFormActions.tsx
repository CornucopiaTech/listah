

import {
  useStore,
} from "@tanstack/react-form";
import RestartIcon from '@iconify-react/mdi/restart';
import RestartOffIcon from '@iconify-react/mdi/restart-off';
import SaveIcon from '@iconify-react/material-symbols/save';
import SaveOffIcon from '@iconify-react/lucide/save-off';
import DeleteIcon from '@iconify-react/mdi/delete';
import DeleteOffIcon from '@iconify-react/mdi/delete-off';
import HourglassOutlineIcon from '@iconify-react/material-symbols/hourglass-outline';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';


import {
  useFormContext,
} from "@/hooks/services/useForm/useForm";
import {
  ItemFormSpeedDialBox,
} from "@/components/core/AppBox";
import type {
  IFormContext,
} from '@/domain/entities';


export function AppUpdateFormActions() {
  const { form, } = useFormContext() as unknown as IFormContext;

  const canSubmit = useStore(form.store, (state: any) => state.errors).length == 0;
  const isSubmitted = useStore(form.store, (state: any) => state.isSubmitted);
  const isDirty = useStore(form.store, (state: any) => state.isDirty);
  const id = useStore(form.store, (state: any) => state.values.id);
  const canDelete = isSubmitted && id !== "";
  const handleDelete = () => {
    form.setFieldValue('softDelete', true);
    form.handleSubmit();
  };

  const dummyAction = () => undefined;

  const saveIcon = isSubmitted ? <HourglassOutlineIcon height="1.5rem" /> :
    canSubmit ? <SaveIcon height="1.5rem" /> : <SaveOffIcon height="1.5rem" />
  return (
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
}
