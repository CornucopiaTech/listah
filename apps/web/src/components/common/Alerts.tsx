import type { ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Icon } from "@iconify/react";



export function Error({ message }: { message: string}): ReactNode {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity="error">{message}</Alert>
    </Stack>
  );
}

export function Success({ message }: { message: string}): ReactNode {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert icon={<Icon icon="material-symbols:check" width="24" height="24" />} severity="success">
        { message }
      </Alert>
    </Stack>
  );
}
