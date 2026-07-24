

import {
  useEffect,
} from "react";
import type {
  ChangeEvent,
  ReactNode,
} from 'react';
import {
  useStore,
} from "@tanstack/react-form";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
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





// Internal imports
import {
  useForms
} from '@/hooks/context';
import type {
  IFormContext,
} from "@/domain/entities";
import {
  CloseDialogButton,
  AppBackdrop,
  ItemFormSpeedDialBox,
} from "@/components";



export function UpdateFormActions() {
  const { form } = useForms() as unknown as IFormContext;

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

export function FormDialog(): ReactNode {
  const {
    title,
    content,
    actions,
    openDialog,
    closeDialog,
    form,
    mutation,
  } = useForms() as unknown as IFormContext;

  const handleFormClose = () => {
    closeDialog();
    form.reset();
    mutation.reset();
  }

  useEffect(() => {
    if (!form.state.isSubmitted) return;
    if (!mutation.isSuccess) return;
    const timer = setTimeout(() => { handleFormClose() }, 1000);
    return () => clearTimeout(timer); // cleanup
  }, [form.state.isSubmitted, mutation.isSuccess]);

  const errorMap = useStore(form.store, (state: any) => state.errorMap);
  const isSubmitted = useStore(form.store, (state: any) => state.isSubmitted);
  const openBackDrop = isSubmitted && !mutation?.isSuccess;


  function onFormSubmit(e: ChangeEvent) {
    e.preventDefault()
    e.stopPropagation()
    //Note: form.handleSubmit is automatically called on form submit. it does not need to be called again. Calling it again results in the form getting sent multiple times.

    //Note:  Modal should not be closed immediately after form submission so success or error feedback can be sent to the user.
  }

  return (
    <Dialog fullWidth maxWidth="lg" open={openDialog} onClose={closeDialog} >
      <DialogTitle id="save-dialog-title" >
        {title}
        <CloseDialogButton closeDialog={closeDialog} />
      </DialogTitle>
      <Divider />
      {mutation.isSuccess && <Alert severity="success"> {"Changes saved!"} </Alert>}

      {mutation.error && <Alert severity="error"> {mutation.error.message} <br />
        {/* @ts-ignore */}
        {mutation.error.tracking && "RequestId: " + mutation.error.tracking}</Alert>
      }
      {errorMap.onChange && <Alert severity="warning"> {`${errorMap.onChange}`} </Alert>}

      <Divider />
      <AppBackdrop showBackDrop={openBackDrop} />
      <form onSubmit={onFormSubmit}>
        <DialogContent > {content} </DialogContent>
        <Divider />
        {actions && <DialogActions> {actions} </DialogActions>}
      </form>
    </Dialog>
  )
}
