

import type { ReactNode } from "react";
import Typography from '@mui/material/Typography';
import { styled, } from '@mui/material/styles';



import type { AppTheme } from '@/system/theme';


const AppButtonTypography = styled(Typography)(({ theme }: { theme: AppTheme }) => ({
  color: theme.palette.primary.contrastText,
  textAlign: "center",
  padding: '0.5em',
}));

export function AppHeroButtonTypography({ children }: { children: ReactNode }){
  return (
    <AppButtonTypography variant="h1">{ children }</AppButtonTypography>
  )
}

export function AppTitleButtonTypography({ children }: { children: ReactNode }){
  return (
    <AppButtonTypography variant="h3">{ children }</AppButtonTypography>
  )
}

export function AppBody1ButtonTypography({ children }: { children: ReactNode }){
  return (
    <AppButtonTypography variant="body1">{ children }</AppButtonTypography>
  )
}

export function AppH5ButtonTypography({ children }: { children: ReactNode }) {
  return (
    <AppButtonTypography variant="h5" sx={{}}>{children}</AppButtonTypography>
  )
}

export function AppH6ButtonTypography({ children }: { children: ReactNode }){
  return (
    <AppButtonTypography variant="h6">{ children }</AppButtonTypography>
  )
}


