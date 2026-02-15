// import type { ReactNode } from 'react';
// import { Fragment } from 'react';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';


import type { AppTheme } from '@/system/theme';



export const AppListHeaderBar = styled(Box)(({ theme }: { theme: AppTheme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  borderRadius: 4,
  padding: 1,
  backgroundColor: theme.palette.primary.main,
}));

