import type { ReactNode } from "react";
import Stack from "@mui/material/Stack";
import Divider from '@mui/material/Divider';

import { SpaceBetweenBox } from "@/components/core/AppBox";



export function WrongAppHomeStack({ children }: { children: ReactNode }): ReactNode {
  return (
    <Stack direction={{ sm: "column", md: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}
      sx={{
        maxWidth: "60vh", width: "60vh",
        height: "60vh",
        display: "flex",
        flexWrap: 'wrap',
        justifyContent: "space-around",
        alignContent: "center",
      }} divider={<Divider orientation="vertical" flexItem />} useFlexGap>
      <SpaceBetweenBox>
        {children}
      </SpaceBetweenBox>

    </Stack>
  );
}

export function AppHomeStack({ children }: { children: ReactNode }): ReactNode {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 2, sm: 4, md: 8 }}
      sx={{
        height: "60%",
        width: '100%',
        marginTop: "10%",
        marginBottom: "10%",

      }} divider={<Divider orientation="vertical" flexItem />} useFlexGap >

      {children}
    </Stack>
  );
}

export function AppListStack({ children }: { children: ReactNode }): ReactNode {
  return (
    <Stack direction={{ sm: "column", md: "row" }} spacing={4}
      sx={{
        maxWidth: "100%", width: "100%",
      }} justifyContent="center" alignItems="center">
      {children}
    </Stack>
  );
}


export function AppSectionStack({ children }: { children: ReactNode }): ReactNode {
  return (
    <Stack direction="column" spacing={2}
      sx={{
        maxWidth: "100%", width: "100%",
      }} justifyContent="center" alignItems="center">
      {children}
    </Stack>
  );
}


export function AppPageStack({ children }: { children: ReactNode }): ReactNode {
  return (
    <Stack direction="column" spacing={2}
      sx={{ width: "100%", maxWidth: "100%", }} justifyContent="center" alignItems="center">
      {children}
    </Stack>
  );
}
