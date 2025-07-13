'use client'
import * as React from 'react';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';


import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider } from '@mui/material/styles';
import {
  Box,
} from '@mui/material';
import { AppNavBar} from '@/components/AppNavBar';

import theme from '@/lib/theme';

const queryClient = new QueryClient();

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <React.Fragment>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: 'teal', height: '100%' }}>
              <AppNavBar />
              {children}
            </Box>
          </ThemeProvider>
        </QueryClientProvider>
    </React.Fragment>
  );
}
