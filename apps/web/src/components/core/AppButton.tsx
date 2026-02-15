import { Button, type ButtonProps } from "@mui/material";
// import { useTheme } from '@mui/material/styles';
import { AppH6ButtonTypography } from "./ButtonTypography";

export type AppButtonProps = ButtonProps & {
  variantType?: "primary" | "secondary";
};


declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    primary: true;
  }
}

export function AppButton({ label, }: { label: string; }) {
  // const theme = useTheme();
  return (
    <Button color={"primary"} variant='contained' disableElevation >
      {label}
    </Button>
  );
}

export function AppButtonOutlined({ label, }: { label: string; }) {
  return (
    <Button variant='contained' disableElevation >
      {label}
    </Button>
  );
}

export function AppButtonContained({ label, }: { label: string; }) {
  return (
    <Button variant='contained' sx={{ padding: 2, margin: 2, borderRadius: 24, width: "100%", textTransform: 'none'}} >
      <AppH6ButtonTypography>
        {label}
      </AppH6ButtonTypography>

    </Button>
  );
}
