

import type { ReactNode } from "react";
import Typography from '@mui/material/Typography';
import { styled, } from '@mui/material/styles';



import type { AppTheme } from '@/system/theme';


const AppTypography = styled(Typography)(({ theme }: { theme: AppTheme }) => ({
  color: theme.palette.primary.main,
  textAlign: "center"
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


export function AppH6Typography({ children }: { children: ReactNode }){
  return (
    <AppTypography variant="h6">{ children }</AppTypography>
  )
}

