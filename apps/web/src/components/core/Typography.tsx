

import type { ReactNode } from "react";
import Typography from '@mui/material/Typography';
import { styled, } from '@mui/material/styles';



import type { AppTheme } from '@/system/theme';


const AppTypography = styled(Typography)(({ theme }: { theme: AppTheme }) => ({
  color: theme.palette.primary.main,
  // textAlign: "center",
  // textAlign: "left",
  whiteSpace: 'pre-line',
}));


export function AppHeroTypography({ children, sx }: { children: ReactNode, sx?: any }) {
  return (
    <AppTypography variant="h1" sx={{ ...sx, textAlign: "center", }}>{children}</AppTypography>
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
