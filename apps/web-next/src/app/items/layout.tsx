'use client'
import * as React from 'react';

import { ThemeProvider } from '@mui/material/styles';
import {
  Box,
} from '@mui/material';
import { AppNavBar} from '@/components/AppNavBar';

import theme from '@/lib/theme';



export default function PageLayout({children,}: Readonly<{ children: React.ReactNode;}>) {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Box sx={{ bgcolor: 'teal', height: '100%'}}>
          <AppNavBar/>
          {children}
        </Box>
      </ThemeProvider>
    </React.Fragment>
  );
}
