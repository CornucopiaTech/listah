


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
  useForms
} from '@/hooks/context';
import type {
  IFormContext,
} from "@/domain/entities";
import {
  CloseDialogButton,
} from "@/components";




export function ViewDialog(): ReactNode {
  const {
    title,
    content,
    actions,
    openDialog,
    closeDialog,
  } = useForms() as unknown as IFormContext;


  return (
    <Dialog fullWidth maxWidth="lg" open={openDialog} onClose={closeDialog}>
      <DialogTitle id="save-dialog-title" sx={{ height: "80px" }}>
        {title}
        <CloseDialogButton closeDialog={closeDialog} />
      </DialogTitle>
      <Divider />
      <Divider />
      <DialogContent > {content} </DialogContent>
      <Divider />
      {actions && <DialogActions> {actions} </DialogActions>}
    </Dialog>
  )
}
