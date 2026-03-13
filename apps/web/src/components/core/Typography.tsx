

import type { ReactNode } from "react";
import Typography from '@mui/material/Typography';
import { styled, } from '@mui/material/styles';



import type { AppTheme } from '@/system/theme';


const AppTypography = styled(Typography)(({ theme }: { theme: AppTheme }) => ({
  color: theme.palette.primary.main,
  textAlign: "center",
  whiteSpace: 'pre-line',
}));


export function AppHeroTypography({ children }: { children: ReactNode }){
  return (
    <AppTypography variant="h1">{ children }</AppTypography>
  )
}

export function AppTitleTypography({ children }: { children: ReactNode }){
  return (
    <AppTypography variant="h3">{ children }</AppTypography>
  )
}

export function AppBody1Typography({ children }: { children: ReactNode }){
  return (
    <AppTypography variant="body1">{ children }</AppTypography>
  )
}


export function AppH6Typography({ children, sx }: { children: ReactNode, sx?: any }) {
  return (
    <AppTypography variant="h6" sx={{...sx, whiteSpace: 'pre-line' }}>{children}</AppTypography>
  )
}

export function AppH4Typography({ children, sx }: { children: ReactNode, sx?: any }) {
  return (
    <AppTypography variant="h4" sx={{ ...sx, whiteSpace: 'pre-line' }}>{children}</AppTypography>
  )
}

export function AppH5Typography({ children, sx }: { children: ReactNode, sx?: any }){
  return (
    <AppTypography variant="h5" sx={{...sx, whiteSpace: 'pre-line' }}>{ children }</AppTypography>
  )
}

