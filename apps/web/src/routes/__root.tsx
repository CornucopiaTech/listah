import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';





import { Suspense, Fragment } from 'react';
import type { ReactNode } from 'react';
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';



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
import { Provider } from 'react-redux'



// import {store} from '@/lib/state/store'

import AppNavBar from '@/components/common/AppNavBar';
import Loading from '@/components/common/Loading';
import theme from '@/lib/theme';
import NotFound from '@/components/common/NotFound';

enableMapSet();




function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ReactQueryDevtools initialIsOpen={false} />
      {/* <Provider store={store}> */}
        <ThemeProvider theme={theme}>
          <Box sx={{ height: '100%' }}>
            <AppNavBar />
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
            <Scripts />
          </Box>
        </ThemeProvider>
      {/* </Provider> */}
    </QueryClientProvider>
  )
}


function RootComponent() {
  return (<RootDocument><Outlet /></RootDocument>);
}


export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Listah',
      },
    ],
  }),
  component: () => <Suspense fallback={Loading}><RootComponent /></Suspense>,
  notFoundComponent: NotFound,
});




// export const Route = createRootRoute({
//   component: () => (
//     <>
//       <Header />
//       <Outlet />
//       <TanStackDevtools
//         config={{
//           position: 'bottom-right',
//         }}
//         plugins={[
//           {
//             name: 'Tanstack Router',
//             render: <TanStackRouterDevtoolsPanel />,
//           },
//         ]}
//       />
//     </>
//   ),
// })
