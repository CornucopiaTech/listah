import type { ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Icon } from "@iconify/react";


import { AppH6Typography } from "@/components/core/Typography";


export function ErrorAlert({ message }: { message: string}): ReactNode {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity="error">
      <AppH6Typography>
        { message }
      </AppH6Typography>
      </Alert>
    </Stack>
  );
}

export function SuccessAlert({ message }: { message: string}): ReactNode {
  return (
      <Alert sx={{display: "flex", alignContent: "center", alignItems: "center", flexWrap: "wrap"}} icon={<Icon icon="material-symbols:check" width="24" height="24" />} severity="success">
        <AppH6Typography>
          { message }
        </AppH6Typography>
      </Alert>
  );
}
