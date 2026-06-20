


import type {
  ReactNode,
} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from "@mui/material/Divider";





// Internal imports
import {
  CloseDialogButton,
} from "@/components/core/AppButton";



export function AlertDialog(
  {
    title, content, actions, openDialog, closeDialog,
  }: {
    title: string, content: ReactNode, actions?: ReactNode,
    openDialog: boolean, closeDialog?: any,
  }): ReactNode {
  return (
    <Dialog fullWidth disableScrollLock maxWidth="lg" open={openDialog} onClose={closeDialog} >
      <DialogTitle id="save-dialog-title" >
        {title}
        <CloseDialogButton closeDialog={closeDialog} />
      </DialogTitle>
      <Divider />
      <DialogContent > {content} </DialogContent>
      <Divider />
      {actions && <DialogActions> {actions} </DialogActions>}
    </Dialog>
  )
}
