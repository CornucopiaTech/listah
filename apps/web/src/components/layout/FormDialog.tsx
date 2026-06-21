

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
import {
  useStore,
} from "@tanstack/react-form";




// Internal imports
import {
  CloseDialogButton,
  AppBackdrop,
} from "@/components/core/AppButton";
import { useFormContext } from '@/hooks/services/useForm';
import type {
  IFormContext,
} from "@/domain/entities"


export function FormDialog(
  {
    title, content, actions, openDialog, closeDialog,
  }: {
    title: string, content: ReactNode, actions?: ReactNode,
    openDialog: boolean, closeDialog: () => void,
  }): ReactNode {

  const { form, mutation } = useFormContext() as unknown as IFormContext;
  useEffect(() => {
    if (!form.state.isSubmitted) return;
    if (!mutation.isSuccess) return;
    const timer = setTimeout(() => { closeDialog(); }, 2000);
    return () => clearTimeout(timer); // cleanup
  }, [form.state.isSubmitted, mutation.isSuccess]);

  const errorMap = useStore(form.store, (state: any) => state.errorMap);
  const isSubmitted = useStore(form.store, (state: any) => state.isSubmitted);
  const openBackDrop = isSubmitted && !mutation.isSuccess;


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
