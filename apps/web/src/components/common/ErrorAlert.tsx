import * as React from 'react';
import {
  Box,
  Alert,
  Stack,
  Button
} from '@mui/material';

export function ErrorAlerts( { children }: { children?: React.ReactNode }) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity="error" >
        {children}
      </Alert>

    </Stack>
  );
}



export function WarnAlerts() {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity="warning" onClose={() => { }}>
        This Alert displays the default close icon.
      </Alert>
      <Alert
        severity="success"
        action={
          <Button color="inherit" size="small">
            UNDO
          </Button>
        }
      >
        This Alert uses a Button component for its action.
      </Alert>
    </Stack>
  );
}

export function InfoAlerts() {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity="warning" onClose={() => { }}>
        This Alert displays the default close icon.
      </Alert>
      <Alert
        severity="success"
        action={
          <Button color="inherit" size="small">
            UNDO
          </Button>
        }
      >
        This Alert uses a Button component for its action.
      </Alert>
    </Stack>
  );
}

export function SuccessAlerts() {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity="warning" onClose={() => { }}>
        This Alert displays the default close icon.
      </Alert>
      <Alert
        severity="success"
        action={
          <Button color="inherit" size="small">
            UNDO
          </Button>
        }
      >
        This Alert uses a Button component for its action.
      </Alert>
    </Stack>
  );
}
