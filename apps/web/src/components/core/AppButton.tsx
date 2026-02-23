import { Button, type ButtonProps } from "@mui/material";
import { styled } from '@mui/material/styles';



import type { AppTheme } from '@/system/theme';




export type AppButtonProps = ButtonProps & {
  variantType?: "primary" | "secondary";
};


declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    primary: true;
  }
}

export const AppResetButton = styled(Button)(({ theme }: { theme: AppTheme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  borderRadius: 24,
  width: "100%",
  textTransform: 'none',
}));


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

// export function AppButtonContained({ label, }: { label: string; }) {
//   return (
//     <Button variant='contained' sx={{ padding: 2, margin: 2, borderRadius: 24, width: "100%", textTransform: 'none'}} >
//       <AppH6ButtonTypography>
//         {label}
//       </AppH6ButtonTypography>

//     </Button>
//   );
// }

export const AppButtonContained = styled(Button)(({ theme }: { theme: AppTheme }) => ({
  padding: "2%",
  margin: "2%",
  borderRadius: 24,
  width: "100%",
  textTransform: 'none',
  background: theme.palette.primary.main
}));
