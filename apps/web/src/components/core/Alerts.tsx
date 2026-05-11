import type { ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import { Icon } from "@iconify/react";


import {
  AppAlertTypography,

} from "@/components/core/Typography";


export function ErrorAlert({ message }: { message: string }): ReactNode {
  return (
    <Alert icon={false} severity="error">
      <AppAlertTypography>
        {message}
      </AppAlertTypography>
    </Alert>
  );
}

export function SuccessAlert({ message }: { message: string }): ReactNode {
  return (
    <Alert sx={{ display: "flex", alignContent: "center", alignItems: "center", flexWrap: "wrap", whiteSpace: 'pre-line' }}
      // icon={<Icon icon="material-symbols:check" width="24" height="24" />}
      icon={false}
      severity="success">
      <AppAlertTypography>
        {message}
      </AppAlertTypography>
    </Alert>
  );
}

export function WarnAlert({ message }: { message: string }): ReactNode {
  return (
    <Alert sx={{ display: "flex", alignContent: "center", alignItems: "center", flexWrap: "wrap", whiteSpace: 'pre-line' }}
      // icon={<Icon icon="material-symbols:warning-outline-rounded" width="16" height="16" />}
      icon={false}
      severity="warning">
      <AppAlertTypography>
        {message}
      </AppAlertTypography>
    </Alert>
  );
}
