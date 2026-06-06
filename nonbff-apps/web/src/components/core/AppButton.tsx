import { Button, type ButtonProps } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { useTheme } from "@mui/material";


import type { AppTheme } from '@/system/theme';
import {
  AppTextButtonTypography,
  AppTextDangerButtonTypography,
  AppTextWarningButtonTypography,
  AppTextMutedButtonTypography,
  AppDefaultButtonTypography,
} from "@/components/core/Typography";



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

export const AppResetButton = styled(Button)(({ theme }: { theme: AppTheme }) => ({
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  borderRadius: 30,//"1%",
  width: "100%",
  textTransform: 'none',
}));

export const AppDefaultButtonBase = styled(Button)(({ theme }: { theme: AppTheme }) => ({
  padding: theme.spacing(1.5),
  margin: theme.spacing(1.5),
  borderRadius: 4,
  textTransform: 'none',
  disableElevation: true,
}));


export function AppDefaultButton({ label, handleClick }: { label: string; handleClick?: () => void }) {
  return <AppDefaultButtonBase variant="contained" onClick={handleClick}>
    <AppDefaultButtonTypography>
      {label}
    </AppDefaultButtonTypography>
  </AppDefaultButtonBase>
}
export function AppDefaultTextButton({ label, handleClick }: { label: string; handleClick?: () => void }) {
  return <AppDefaultButtonBase variant="text" onClick={handleClick}>
    <AppTextButtonTypography>
      {label}
    </AppTextButtonTypography>
  </AppDefaultButtonBase>
}


export function AppDangerButton({ label, handleClick }: { label: string; handleClick?: () => void }) {
  const theme = useTheme();
  return <AppDefaultButtonBase variant='contained' disableElevation onClick={handleClick}
    sx={{
      backgroundColor: theme.palette.error.main,
      '&:hover': { backgroundColor: theme.palette.error.dark, },
    }}
  >
    <AppDefaultButtonTypography>
      {label}
    </AppDefaultButtonTypography>
  </AppDefaultButtonBase>
}
export function AppDangerTextButton({ label, handleClick }: { label: string; handleClick?: () => void }) {
  const theme = useTheme();
  return <AppDefaultButtonBase variant='text' disableElevation onClick={handleClick}
    sx={{
      color: theme.palette.error.main,
      '&:hover': { color: theme.palette.error.dark, },
    }}
  >
    <AppTextDangerButtonTypography>
      {label}
    </AppTextDangerButtonTypography>
  </AppDefaultButtonBase>
}

export function AppWarnButton({ label, handleClick }: { label: string; handleClick?: () => void }) {
  const theme = useTheme();
  return <AppDefaultButtonBase variant='contained' disableElevation onClick={handleClick}
    sx={{
      backgroundColor: theme.palette.secondary.main,
      '&:hover': { backgroundColor: theme.palette.secondary.dark, },
    }}
  >
    <AppDefaultButtonTypography>
      {label}
    </AppDefaultButtonTypography>
  </AppDefaultButtonBase>
}
export function AppWarnTextButton({ label, handleClick }: { label: string; handleClick?: () => void }) {
  const theme = useTheme();
  return <AppDefaultButtonBase variant='contained' disableElevation onClick={handleClick}
    sx={{
      color: theme.palette.secondary.main,
      '&:hover': { color: theme.palette.secondary.dark, },
    }}
  >
    <AppTextWarningButtonTypography>
      {label}
    </AppTextWarningButtonTypography>
  </AppDefaultButtonBase>
}

export function AppMutedButton({ label, handleClick }: { label: string; handleClick?: () => void }) {
  const theme = useTheme();
  return <AppDefaultButtonBase variant='contained' disableElevation onClick={handleClick}
    sx={{
      backgroundColor: theme.palette.muted.main,
      '&:hover': { backgroundColor: theme.palette.muted.main, },
    }}
  >
    <AppDefaultButtonTypography>
      {label}
    </AppDefaultButtonTypography>
  </AppDefaultButtonBase>
}
export function AppMutedTextButton({ label, handleClick }: { label: string; handleClick?: () => void }) {
  const theme = useTheme();
  return <AppDefaultButtonBase variant='text' disableElevation onClick={handleClick}
    sx={{
      color: theme.palette.muted.main,
      '&:hover': { color: theme.palette.muted.main, },
    }}
  >
    <AppTextMutedButtonTypography>
      {label}
    </AppTextMutedButtonTypography>
  </AppDefaultButtonBase>
}



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

export const AppButtonContained = styled(Button)(({ theme }: { theme: AppTheme }) => ({
  padding: "2%",
  margin: "2%",
  borderRadius: 24,
  width: "100%",
  textTransform: 'none',
  background: theme.palette.primary.main
}));
