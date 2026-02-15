import type { ReactNode } from "react";
// import { Fragment } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Stack from "@mui/material/Stack";


import type { AppTheme } from '@/system/theme';



export const AppBox = styled(Box)(({ theme }: { theme: AppTheme }) => ({
  maxWidth: "77vw",
  // height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.palette.background.default,
}));


export function AppListBox({ children }: { children: ReactNode }): ReactNode {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
      sx={{
        maxWidth: "100%", width: "100%",}} justifyContent="center" alignItems="center">
      {children}
    </Stack>
  );
}


export function AppPageStack({ children }: { children: ReactNode }): ReactNode {
  return (
    <Stack direction="column" spacing={2}
      sx={{ width: "80vw", maxWidth: "80vw", }} justifyContent="center" alignItems="center">
      {children}
    </Stack>
  );
}


export function AppContainerStack({ children }: { children: ReactNode }): ReactNode {
  return (
    <Stack direction="column" spacing={2}
      sx={{ width: "100%", maxWidth: "100%", m:0, p: 0}} justifyContent="center" alignItems="center">
      {children}
    </Stack>
  );
}

