'use client'
import { Suspense, Fragment, ReactNode } from 'react';

import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';


import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ItemsStoreProvider } from "@/lib/store/items/ItemsStoreProvider";
import { UpdatedItemStoreProvider } from '@/lib/store/updatedItem/UpdatedItemStoreProvider';
import { ThemeProvider } from '@mui/material/styles';
import {
  Box,
} from '@mui/material';
import { AppNavBar} from '@/components/AppNavBar';
import Loading from '@/components/Loading';
import theme from '@/lib/theme';


export default function PageLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>){
  return (
    <Fragment>
        <QueryClientProvider client={new QueryClient()}>
          <ItemsStoreProvider>
            <UpdatedItemStoreProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            <ThemeProvider theme={theme}>
              <Box sx={{ /*bgcolor: 'teal',*/ height: '100%' }}>
                <AppNavBar />
                <Suspense fallback={<Loading />}>
                  {children}
                </Suspense>
              </Box>
            </ThemeProvider>
            </UpdatedItemStoreProvider>
          </ItemsStoreProvider>
        </QueryClientProvider>
    </Fragment>
  );
}
