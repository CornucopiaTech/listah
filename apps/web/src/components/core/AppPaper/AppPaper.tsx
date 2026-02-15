
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';



import type { AppTheme } from '@/system/theme';



export const AppStyledPaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
  // width: "100vw",
  // height: "100vh",
  // padding: theme.spacing(2),
  // ...theme.typography.body2,
  // textAlign: 'center',
  backgroundColor: theme.palette.primary.light,
}));

export const AppPaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
  width: "80%",
  height: "80%",
  // padding: theme.spacing(2),
  // margin: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
  backgroundColor: theme.palette.background.paper,
}));

export const AppHeroPaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
  width: "80vw",
  height: "70vh",
  display: "flex",
  flexWrap: 'wrap',
  justifyContent: "center",
  alignContent: "center",
  marginTop: "20vh",
  marginBottom: "20vh",
  backgroundColor: theme.palette.background.paper,
  // boxShadow: 24,
  borderRadius: 8,
  padding: "8%"
}));

// export const AppHeroPaper
