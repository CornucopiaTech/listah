
import type { ReactNode } from 'react';
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


import AppNavBar from '@/components/common/AppNavBar';
import Loading from '@/components/common/Loading';
import theme from '@/lib/theme';


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider theme={theme}>
        <Box sx={{ height: '100%' }}>
          <AppNavBar />
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
