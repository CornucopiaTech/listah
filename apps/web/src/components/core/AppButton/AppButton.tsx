import { Button, type ButtonProps } from "@mui/material";
import { useTheme } from '@mui/material/styles';

export type AppButtonProps = ButtonProps & {
  variantType?: "primary" | "secondary";
};


declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    custom: true;
  }
}

export function AppButton({ label, }: { label: string; }) {
  const theme = useTheme();
  const color = theme.palette.primary.main as string;
  return (
    <Button color={"primary"} variant='contained' disableElevation >
      {label}
    </Button>
  );
}

export function AppButtonOutlined({ label, }: { label: string; }) {
  return (
    <Button type="button" variant='contained' disableElevation >
      {label}
    </Button>
  );
}

export function AppButtonContained({ label, }: { label: string; }) {
  return (
    <Button type="button" variant='contained'  >
      {label}
    </Button>
  );
}
