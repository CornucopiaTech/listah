import type { ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import { Icon } from "@iconify/react";


import { AppH6Typography } from "@/components/core/Typography";


export function ErrorAlert({ message }: { message: string}): ReactNode {
  return (
      <Alert severity="error">
      <AppH6Typography>
        { message }
      </AppH6Typography>
      </Alert>
  );
}

export function SuccessAlert({ message }: { message: string}): ReactNode {
  return (
    <Alert sx={{ display: "flex", alignContent: "center", alignItems: "center", flexWrap: "wrap", whiteSpace: 'pre-line' }} icon={<Icon icon="material-symbols:check" width="24" height="24" />} severity="success">
        <AppH6Typography>
          { message }
        </AppH6Typography>
      </Alert>
  );
}

export function WarnAlert({ message }: { message: string}): ReactNode {
  return (
    <Alert sx={{ display: "flex", alignContent: "center", alignItems: "center", flexWrap: "wrap", whiteSpace: 'pre-line' }} icon={<Icon icon="material-symbols:warning-outline-rounded" width="24" height="24" />} severity="warning">
        <AppH6Typography>
          { message }
        </AppH6Typography>
      </Alert>
  );
}
