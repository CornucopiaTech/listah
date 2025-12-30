import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '@mui/material/styles';
import {
  Box,
} from '@mui/material';
import { Suspense, Fragment } from 'react';



import { initalWebappContext, WebAppContext } from "@/lib/context/webappContext";
import AppNavBar from '@/components/common/AppNavBar';
import Loading from '@/components/common/Loading';
import theme from '@/lib/theme';
import NotFound from '@/components/common/NotFound';



export const Route = createFileRoute('/_pathlessLayout')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <WebAppContext value={initalWebappContext.userId}>
      <ThemeProvider theme={theme}>
        <Box sx={{ height: '100%' }}>
          <AppNavBar />
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </Box>
      </ThemeProvider>
    </WebAppContext>
  )
}
