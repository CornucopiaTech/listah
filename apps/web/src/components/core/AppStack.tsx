import type { ReactNode } from "react";
import Stack from "@mui/material/Stack";
import Divider from '@mui/material/Divider';




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
      sx={{ width: "90%", maxWidth: "90%", }} justifyContent="center" alignItems="center">
      {children}
    </Stack>
  );
}

export function AppCategoryStack({ children }: { children: ReactNode }): ReactNode {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 6, sm: 2 }}
      sx={{ width: "100%", maxWidth: "100%" }} justifyContent="center" alignItems="center">
      {children}
    </Stack>
  );
}

export function AppToolbarStack({ children }: { children: ReactNode }): ReactNode {
  return (
    <Stack direction="row"
      spacing={0}
      // spacing={{ xs: 1, sm: 2 }}
      sx={{ width: "100%", maxWidth: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", }} >
      {children}
    </Stack>
  );
}
