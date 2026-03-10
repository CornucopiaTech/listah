import type { ReactNode } from "react";
import Stack from "@mui/material/Stack";



export function AppListStack({ children }: { children: ReactNode }): ReactNode {
  return (
    <Stack direction={{ sm: "column", md: "row" }} spacing={4}
      sx={{
        maxWidth: "100%", width: "100%",}} justifyContent="center" alignItems="center">
      {children}
    </Stack>
  );
}


export function AppSectionStack({ children }: { children: ReactNode }): ReactNode {
  return (
    <Stack direction="column" spacing={2}
      sx={{
        maxWidth: "100%", width: "100%",}} justifyContent="center" alignItems="center">
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


export function AppContainerStack({ sx, children }: { sx?: any, children: ReactNode }): ReactNode {
  return (
    <Stack direction="column" spacing={2}
      sx={{ ...sx, width: "100vw", maxWidth: "100vw", height: `fit-content`, }} justifyContent="center" alignItems="center">
      {children}
    </Stack>
  );
}
