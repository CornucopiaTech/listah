import type { ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


export function Error({ message }: { message: string}): ReactNode {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity="error" >
        {message}
      </Alert>
    </Stack>
  );
}



export function WarnAlerts(): ReactNode {
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

export function InfoAlerts(): ReactNode {
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

export function SuccessAlerts(): ReactNode {
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
