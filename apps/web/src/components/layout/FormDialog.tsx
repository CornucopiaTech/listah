

import {
  useEffect,
} from "react";
import type {
  ChangeEvent,
  ReactNode,
} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';





// Internal imports
import {
  CloseDialogButton,
  AppBackdrop,
} from "@/components/core/AppButton";


export function FormDialog({
  title, content, actions, openDialog, showBackDrop,
  form, mutation, formWarning,
  closeDialog,
}: {
  title: string, content: ReactNode, actions?: ReactNode,
  openDialog: boolean, showBackDrop: boolean,
  form: any, mutation: any, formWarning: any,
  closeDialog: () => void,
}): ReactNode {


  useEffect(() => {
    if (!form.state.isSubmitted) return;
    if (!mutation.isSuccess) return;
    const timer = setTimeout(() => { closeDialog(); }, 2000);
    return () => clearTimeout(timer); // cleanup
  }, [form.state.isSubmitted, mutation.isSuccess]);


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
      {formWarning && <Alert severity="warning"> {`${formWarning}`} </Alert>}
      <Divider />
      <AppBackdrop showBackDrop={showBackDrop} />
      <form onSubmit={onFormSubmit}>
        <DialogContent > {content} </DialogContent>
        <Divider />
        {actions && <DialogActions> {actions} </DialogActions>}
      </form>
    </Dialog>
  )
}
