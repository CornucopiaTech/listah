
import type { ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
// import { useTheme } from '@mui/material/styles';


import type { AppTheme } from '@/system/theme';
import {
  AppBarHeight,
} from '@/utils/defaults';


export const AppStyledPaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
  width: "100%",
  height: "100%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 4,
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


export function AppSearchPaper({ children }: { children: ReactNode }) {
  return (
    <AppStyledPaper sx={{ width: "30vw", height: AppBarHeight }}>
      {/* <AppStyledPaper elevation={8} sx={{ width: "100%", }}> */}
      {children}
    </AppStyledPaper>
  );
}

// export function AppPagePaper({ sx, children }: { sx?: any, children: ReactNode }) {
//   return (
//     <AppStyledPaper elevation={2} sx={{
//       ...sx,
//       borderRadius: 4,
//       width: '100%',
//       maxWidth: '100%',
//       height: "fit-content",
//     }}>
//       {children}
//     </AppStyledPaper>
//   );
// }

export const AppPagePaper = styled(Paper)(({ theme }: { theme: AppTheme }) => ({
  borderRadius: 4,
  width: '100%',
  maxWidth: '100%',
  height: "fit-content",
})
);



// ({ sx, children }: { sx?: any, children: ReactNode }) {
//   return (
//     <AppStyledPaper elevation={2} sx={{
//       ...sx,

//     }}>
//       {children}
//     </AppStyledPaper>
//   );
// }
