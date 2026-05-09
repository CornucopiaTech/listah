import { Button, type ButtonProps } from "@mui/material";
import { styled } from '@mui/material/styles';



import type { AppTheme } from '@/system/theme';
import {
  AppDialogButtonTypography,
} from "@/components/core/Typography";



export type AppButtonProps = ButtonProps & {
  variantType?: "primary" | "secondary";
};


declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    primary: true;
  }
}

export const AppPrimaryButton = styled(Button)(() => ({
  borderRadius: 3,
  textTransform: 'none',
}));

export const AppResetButton = styled(Button)(({ theme }: { theme: AppTheme }) => ({
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  borderRadius: 30,//"1%",
  width: "100%",
  textTransform: 'none',
}));

export const AppDialogActionButtonBase = styled(AppPrimaryButton)(({ theme }: { theme: AppTheme }) => ({
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  borderRadius: 30,//"1%",
  textTransform: 'none',
}));

export function AppDialogActionButton({ label, handleClick }: { label: string; handleClick?: () => void }) {

  return <AppDialogActionButtonBase variant='contained' disableElevation onClick={handleClick}>
    <AppDialogButtonTypography>
      {label}
    </AppDialogButtonTypography>
  </AppDialogActionButtonBase>
}

// export const AppResetButton = styled(Button)(({ theme }: { theme: AppTheme }) => ({
//   padding: theme.spacing(2),
//   margin: theme.spacing(2),
//   borderRadius: 24,
//   width: "100%",
//   textTransform: 'none',
// }));


export function AppButton({ label, }: { label: string; }) {
  // const theme = useTheme();
  return (
    <Button color={"primary"} variant='contained' disableElevation >
      {label}
    </Button>
  );
}

export function AppButtonOutlined({ label, }: { label: string; }) {
  return (
    <Button variant='contained' disableElevation >
      {label}
    </Button>
  );
}

// export function AppButtonContained({ label, }: { label: string; }) {
//   return (
//     <Button variant='contained' sx={{ padding: 2, margin: 2, borderRadius: 24, width: "100%", textTransform: 'none'}} >
//       <AppH6ButtonTypography>
//         {label}
//       </AppH6ButtonTypography>

//     </Button>
//   );
// }

export const AppButtonContained = styled(Button)(({ theme }: { theme: AppTheme }) => ({
  padding: "2%",
  margin: "2%",
  borderRadius: 24,
  width: "100%",
  textTransform: 'none',
  background: theme.palette.primary.main
}));
