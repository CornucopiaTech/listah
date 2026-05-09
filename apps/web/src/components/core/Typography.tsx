

import type { ReactNode } from "react";
import Typography from '@mui/material/Typography';
import { styled, useTheme, } from '@mui/material/styles';



import type { AppTheme } from '@/system/theme';


const AppTypography = styled(Typography)(({ theme }: { theme: AppTheme }) => ({
  color: theme.palette.text.primary,
  // textAlign: "center",
  // textAlign: "left",
  whiteSpace: 'pre-line',
}));


export function AppHeroTypography({ children, sx }: { children: ReactNode, sx?: any }) {
  return (
    <AppTypography variant="h1" sx={{ ...sx, textAlign: "center", }}>{children}</AppTypography>
  )
}

export function AppToolbarTypography({ children, sx }: { children: ReactNode, sx?: any }) {
  const theme: AppTheme = useTheme();
  return (
    <Typography variant="h6" sx={{ ...sx, textAlign: "left", color: theme.palette.primary.contrastText, }}>{children}</Typography>
  )
}

export function AppListItemTypography({ children, sx }: { children: ReactNode, sx?: any }) {
  const theme: AppTheme = useTheme();
  return (
    <Typography variant="subtitle1" sx={{ ...sx, textAlign: "left", color: theme.palette.primary.dark, }}>{children}</Typography>
  )
}

export function AppAlertTypography({ children, sx }: { children: ReactNode, sx?: any }) {
  return (
    <Typography variant="subtitle1" sx={{ ...sx, textAlign: "left" }}>{children}</Typography>
  )
}


export function AppDialogButtonTypography({ children, sx }: { children: ReactNode, sx?: any }) {
  const theme: AppTheme = useTheme();
  return (
    <Typography variant="subtitle2" sx={{ ...sx, textAlign: "center", color: theme.palette.primary.contrastText, }}>{children}</Typography>
  )
}



export function AppTitleTypography({ children, sx }: { children: ReactNode, sx?: any }) {
  return (
    <AppTypography variant="h3" sx={{ ...sx }}>{children}</AppTypography>
  )
}

export function AppBody1Typography({ children, sx }: { children: ReactNode, sx?: any }) {
  return (
    <AppTypography align="left" variant="body1" sx={{ ...sx }}>{children}</AppTypography>
  )
}

export function AppBody2Typography({ children, sx }: { children: ReactNode, sx?: any }) {
  return (
    <AppTypography variant="body2" sx={{ ...sx }}>{children}</AppTypography>
  )
}

export function AppSubtitle1Typography({ children, sx }: { children: ReactNode, sx?: any }) {
  return (
    <AppTypography variant="subtitle1" sx={{ ...sx }}>{children}</AppTypography>
  )
}

export function AppSubtitle2Typography({ children, sx }: { children: ReactNode, sx?: any }) {
  return (
    <AppTypography variant="subtitle2" sx={{ ...sx }}>{children}</AppTypography>
  )
}


export function AppH6Typography({ children, sx }: { children: ReactNode, sx?: any }) {
  return (
    <AppTypography variant="h6" sx={{ ...sx }}>{children}</AppTypography>
  )
}

export function AppH5Typography({ children, sx }: { children: ReactNode, sx?: any }) {
  return (
    <AppTypography variant="h5" sx={{ ...sx, textTransform: "none" }}>{children}</AppTypography>
  )
}

export function AppH4Typography({ children, sx }: { children: ReactNode, sx?: any }) {
  return (
    <AppTypography variant="h4" sx={{ ...sx }}>{children}</AppTypography>
  )
}
