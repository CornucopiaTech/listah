import { Button, type ButtonProps } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';



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
