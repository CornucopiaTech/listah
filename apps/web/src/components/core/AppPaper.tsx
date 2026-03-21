
import type { ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
// import { useTheme } from '@mui/material/styles';


import type { AppTheme } from '@/system/theme';



export const AppStyledPaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  margin: 0,
  padding: 0,
})
);




export const AppPaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 4,
})
);

export const AppHeroPaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
  // width: "80vw",
  height: "60vh",
  display: "flex",
  flexWrap: 'wrap',
  justifyContent: "center",
  alignContent: "center",
  marginTop: "10vh",
  marginBottom: "10vh",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  padding: "8%"
}));

// export const HeroPaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
//   // width: "80vw",
//   // height: "70vh",
//   // display: "flex",
//   // flexWrap: 'wrap',
//   // justifyContent: "center",
//   // alignContent: "center",
//   // marginTop: "20vh",
//   // marginBottom: "20vh",
//   backgroundColor: theme.palette.background.paper,
//   borderRadius: 8,
//   padding: "8%"
// }));

// export function AppHeroPaper({ children, sx }: { children: ReactNode, sx?: any }): ReactNode {
//   const theme: AppTheme = useTheme();
//   return (
//     <HeroPaper elevation={8} sx={{
//       ...sx,
//       width: "fit-content",
//       height: "60vh",
//       display: "flex",
//       flexWrap: 'wrap',
//       justifyContent: "center",
//       alignContent: "center",
//       marginTop: "10vh",
//       marginBottom: "10vh",
//       backgroundColor: theme.palette.background.paper,
//       borderRadius: 8,
//       padding: "8%"
//     }}>
//       {children}
//     </HeroPaper>
//   );
// }


export const AppHomePaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
  // width: "80%",
  height: "fit-content",
  display: "flex",
  // flexWrap: 'wrap',
  // justifyContent: "center",
  // alignContent: "center",
  // marginTop: "20%",
  // marginBottom: "20%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  // padding: "8%"
}));


export function AppSearchPaper({ children }: { children: ReactNode }) {
  return (
    <AppStyledPaper elevation={8} sx={{ width: "100%", }}>
      {children}
    </AppStyledPaper>
  );
}

export function AppCategoryListPaper({ sx, children }: { sx?: any, children: ReactNode }) {
  return (
    <AppStyledPaper elevation={8} sx={{
      ...sx,
      borderRadius: 4,
      width: '100%',
      maxWidth: '100%',
      height: "fit-content",
    }}>
      {children}
    </AppStyledPaper>
  );
}

export function AppItemListPaper({ children }: { children: ReactNode }) {
  return (
    <AppStyledPaper
      elevation={8}
      sx={{ borderRadius: 4, width: "100%", maxWidth: "100%", height: "fit-content", }}>
      {children}
    </AppStyledPaper>
  );
}


export const AppListPaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
  // width: "50vw",
  maxWidth: "50%",
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
