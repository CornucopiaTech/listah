
import  type { ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';


import type { AppTheme } from '@/system/theme';




export const AppStyledPaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  margin: 0,
  padding: 0,
}));

export function AppSearchPaper( { children }: { children: ReactNode}) {
  return (
    <AppStyledPaper elevation={8}>
      {children}
    </AppStyledPaper>
  );
}


export const AppPaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 4,
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
  borderRadius: 8,
  padding: "8%"
}));


// export const AppCategoryListPaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
//   width: "100%",
//   maxWidth: "100%",
//   display: "flex",
//   flexWrap: 'wrap',
//   justifyContent: "center",
//   alignContent: "center",
//   backgroundColor: theme.palette.background.paper,
//   borderRadius: 4,
// }));

export function AppCategoryListPaper({ children }: { children: ReactNode }) {
  return (
    <AppStyledPaper elevation={8} sx={{borderRadius: 4,}}>
      {children}
    </AppStyledPaper>
  );
}


export const AppItemListPaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
  width: "100%",
  maxWidth: "100%",
  display: "flex",
  flexWrap: 'wrap',
  justifyContent: "center",
  alignContent: "center",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 4,
}));

export const AppListPaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
  // width: "50vw",
  maxWidth: "50vw",
  // height: "70vh",
  display: "flex",
  flexWrap: 'wrap',
  justifyContent: "center",
  alignContent: "center",
  marginLeft: "1vw",
  marginRight: "1vw",
  marginTop: "2vh",
  marginBottom: "2vh",
  backgroundColor: theme.palette.background.paper,
  // boxShadow: 24,
  borderRadius: 4,
  // padding: "8%"
}));


