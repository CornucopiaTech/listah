import { Button, type ButtonProps } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { Icon } from "@iconify/react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


export type AppButtonProps = ButtonProps & {
  variantType?: "primary" | "secondary";
};


export const AppModalCloseButton = styled(IconButton)(() => ({
  display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
}));

export const AppPrimaryButton = styled(Button)(() => ({
  borderRadius: 3,
  textTransform: 'none',
}));


export function CloseDialogButton({ closeDialog }: { closeDialog: () => void }) {
  return (
    <AppModalCloseButton aria-label="close dialog"
      size="small" onClick={closeDialog}>
      <Icon icon="material-symbols-light:close-rounded" width="30" height="30" />
    </AppModalCloseButton>
  );
}

export function AppBackdrop({ showBackDrop }: { showBackDrop: boolean }) {
  return (
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={showBackDrop}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
