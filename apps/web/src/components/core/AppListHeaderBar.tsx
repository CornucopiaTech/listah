// import type { ReactNode } from 'react';
// import { Fragment } from 'react';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';


import type { AppTheme } from '@/system/theme';



export const ListHeaderBar = styled(Box)(({ theme }: { theme: AppTheme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  // borderRadius: "4px",
  padding: 1,
  backgroundColor: theme.palette.primary.main,
}));



export function AppListHeaderBar( { children }: { children: React.ReactNode }) {
  return (
    <ListHeaderBar sx={{borderRadius: "4px 4px 0px 0px"}}>
      {children}
    </ListHeaderBar>
  );
};

