import type { ReactNode } from "react";
import Stack from "@mui/material/Stack";


export function AppToolbarStack({ children }: { children: ReactNode }): ReactNode {
  return (
    <Stack direction="row"
      spacing={0}
      sx={{ width: "100%", maxWidth: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", }} >
      {children}
    </Stack>
  );
}
