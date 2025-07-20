'use client'
import { Suspense, Fragment } from 'react';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material/styles';
import {
  Box,
} from '@mui/material';
import { enableMapSet } from 'immer';


import { AppNavBar} from '@/components/AppNavBar';
import Loading from '@/components/Loading';
import theme from '@/lib/theme';
import { ItemsStoreProvider } from "@/lib/store/items/ItemStoreProvider";

enableMapSet();

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <Fragment>
      <ItemsStoreProvider>
        <QueryClientProvider client={new QueryClient()}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: 'teal', height: '100%' }}>
              <AppNavBar />
              <Suspense fallback={<Loading />}>
                {children}
              </Suspense>
            </Box>
          </ThemeProvider>
        </QueryClientProvider>
      </ItemsStoreProvider>
    </Fragment>
  );
}
