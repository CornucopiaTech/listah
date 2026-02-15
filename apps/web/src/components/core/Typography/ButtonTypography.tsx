

import type { ReactNode } from "react";
import Typography from '@mui/material/Typography';
import { styled, } from '@mui/material/styles';



import type { AppTheme } from '@/system/theme';

// export function HeroTypography(){
//   return
// }


const AppTypography = styled(Typography)(({ theme }: { theme: AppTheme }) => ({
  color: theme.palette.primary.main,
  // fontWeight: 'bold',
  textAlign: "center"
}));

const AppButtonTypography = styled(Typography)(({ theme }: { theme: AppTheme }) => ({
  color: theme.palette.primary.contrastText,
  // fontWeight: 'bold',
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



export function AppH5ButtonTypography({ children }: { children: ReactNode }){
  return (
    <AppButtonTypography variant="h5">{ children }</AppButtonTypography>
  )
}

export function AppH6ButtonTypography({ children }: { children: ReactNode }){
  return (
    <AppButtonTypography variant="h6">{ children }</AppButtonTypography>
  )
}

export function AppBody1ButtonTypography({ children }: { children: ReactNode }){
  return (
    <AppButtonTypography variant="body1">{ children }</AppButtonTypography>
  )
}
