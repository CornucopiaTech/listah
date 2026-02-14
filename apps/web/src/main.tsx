import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createRouter
} from '@tanstack/react-router'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react'
import { enableMapSet } from 'immer';
import { ThemeProvider, } from '@mui/material/styles';



// Internal imports
// Import the generated route tree
import { routeTree } from './routeTree.gen'
import reportWebVitals from './reportWebVitals.ts'
import Loading from '@/components/common/Loading';
import NotFound from '@/components/common/NotFound';
import { Error } from '@/components/common/Error';
// import * as theme from '@/lib/styles/theme';
import theme from '@/system/theme';


declare global {
  interface Window {
    runtimeConfig: {
      authKey: string;
      apiUrl: string;
    };
  }
}

export { };

enableMapSet();
export const queryClient = new QueryClient();


const router = createRouter({
  routeTree,
  defaultPendingComponent: Loading,
  defaultErrorComponent: ({ error }) => <Error message={error.message} />,
  defaultNotFoundComponent: NotFound,
  Wrap: Wrapper,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})


// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


function Wrapper( { children }: { children: React.ReactNode } ) {
  const aKey = window.runtimeConfig.authKey;
  return (
    <ThemeProvider theme={theme}>
    {/* <ThemeProvider theme={theme.materialTheme}> */}
      <ClerkProvider publishableKey={aKey}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ClerkProvider>
    </ThemeProvider>
  )
};

async function loadConfig() {
  const res = await fetch('/config.json');
  const config = await res.json();
  window.runtimeConfig = config;
}

loadConfig().then(
  () => {
    const rootElement = document.getElementById('app')
    if (rootElement && !rootElement.innerHTML) {
      const root = ReactDOM.createRoot(rootElement)
      root.render(
        <RouterProvider
          router={router}
          defaultPreload="intent"
          defaultPendingMs={0}
          defaultPendingMinMs={0}
          context={{
            queryClient,
          }}
        />
      )
    }
});



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log)
