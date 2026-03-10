

import type { ReactNode } from "react";
import Typography from '@mui/material/Typography';
import { styled, } from '@mui/material/styles';



import type { AppTheme } from '@/system/theme';


const AppButtonTypography = styled(Typography)(({ theme }: { theme: AppTheme }) => ({
  color: theme.palette.primary.contrastText,
  textAlign: "center",
  // padding: '0.5em',
}));

export function AppHeroButtonTypography({ children, sx }: { children: ReactNode, sx?: any }){
  return (
    <AppButtonTypography variant="h1" sx={{ ...sx }}>{ children }</AppButtonTypography>
  )
}

export function AppTitleButtonTypography({ children, sx }: { children: ReactNode, sx?: any }){
  return (
    <AppButtonTypography variant="h3" sx={{ ...sx }}>{ children }</AppButtonTypography>
  )
}

export function AppBody1ButtonTypography({ children, sx }: { children: ReactNode, sx?: any }){
  return (
    <AppButtonTypography variant="body1" sx={{...sx}}>{ children }</AppButtonTypography>
  )
}

export function AppH4ButtonTypography({ children, sx }: { children: ReactNode, sx?: any }) {
  return (
    <AppButtonTypography variant="h4" sx={{ ...sx, display: "inline-flex", alignItems: 'center' , alignContent: 'center' }}>{children}</AppButtonTypography>
  )
}

export function AppH5ButtonTypography({ children, sx }: { children: ReactNode, sx?: any }) {
  return (
    <AppButtonTypography variant="h5" sx={{...sx}}>{children}</AppButtonTypography>
  )
}

export function AppH6ButtonTypography({ children, sx }: { children: ReactNode, sx?: any }){
  return (
    <AppButtonTypography variant="h6" sx={{ ...sx, display: 'flex', alignItems: 'center', }}>{ children }</AppButtonTypography>
  )
}


