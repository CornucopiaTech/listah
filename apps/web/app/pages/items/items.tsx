'use client'
import * as React from 'react';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';


import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider } from '@mui/material/styles';
import {
  CssBaseline,
  Box,
} from '@mui/material';



import { AppNavBar} from '@/components/AppNavBar';
import { ItemsDrawer} from "@/components/ItemsDrawer";
import ItemsDatePicker from "@/components/ItemsDatePicker";
import ItemsList from "@/components/ItemsList";
import ItemsSearch from '@/components/ItemsSearch';
import { AppBarHeight } from '@/components/AppNavBar';



import theme from '@/lib/theme';

const queryClient = new QueryClient();

export default function Items(){
  return (
    <React.Fragment>
        <QueryClientProvider client={queryClient}>
          {/* The rest of your application */}
          <ReactQueryDevtools initialIsOpen={false} />
          <CssBaseline/>
          <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: 'teal', height: '100%' }}>
              <AppNavBar />
              <Box  sx={{ bgcolor: 'pink', m:0,
                // height: `100%`,
                height: `calc(100% - ${AppBarHeight})`,
                }}>
                <Box  key='head-content'
                      sx={{ bgcolor: 'rgba(0,255,0,0.1)', display: 'flex',
                      mb: 2, mx: 4, justifyContent: 'space-between' }}>
                  <ItemsDrawer />
                  <ItemsSearch />
                  <ItemsDatePicker />
                </Box>
                <ItemsList key='item-list' />
              </Box>

            </Box>
          </ThemeProvider>
        </QueryClientProvider>
    </React.Fragment>
  );
}
