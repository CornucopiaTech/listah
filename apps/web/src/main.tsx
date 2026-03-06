import { StrictMode, useEffect, useMemo } from 'react';
import type { ReactNode } from "react";
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createRouter,
} from '@tanstack/react-router'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react'
import { enableMapSet } from 'immer';
import { ThemeProvider, } from '@mui/material/styles';
import { useUser } from '@clerk/clerk-react';


// Internal imports
// Import the generated route tree
import { routeTree } from './routeTree.gen'
import reportWebVitals from './reportWebVitals.ts'
import Loading from '@/components/common/Loading';
import NotFound from '@/components/common/NotFound';
import { ErrorAlert} from "@/components/core/Alerts";
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
  defaultErrorComponent: ({ error }) => <ErrorAlert message={error.message} />,
  defaultNotFoundComponent: NotFound,
  Wrap: Wrapper,
  context: {
    queryClient,
    user: undefined,
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



function Wrapper( { children }: { children: ReactNode } ) {
  return (
    <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
    </ThemeProvider>
  )
};

async function loadConfig() {
  const res = await fetch('/config.json');
  const config = await res.json();
  window.runtimeConfig = config;
}

function StrictModeWrapper({ children }: { children: ReactNode}) {
  if (process.env.NODE_ENV === "development") {
    return <StrictMode>{children}</StrictMode>
  }
  return children
}

function App() {
  const { user, } = useUser();

  console.info("In App component - user ", user);

  // Use a useMemo for the context value to ensure stable object reference
  const routerContext = useMemo(() => {
    return {
      user,
      queryClient
    }
  }, [user])

  // Invalidate the router when the context state changes
  useEffect(() => {
    // This tells the router to recompute the context for all routes
    router.invalidate();
  }, [routerContext, router])

  return (
    <StrictModeWrapper>
      <RouterProvider
        router={router}
        defaultPreload="intent"
        defaultPendingMs={0}
        defaultPendingMinMs={0}
        context={{
          queryClient,
          user,
        }}
      />
    </StrictModeWrapper>
  )
}

console.info("Node environment", process.env.NODE_ENV)
loadConfig().then(
  () => {
    const aKey = window.runtimeConfig.authKey;
    const rootElement = document.getElementById('app')
    if (rootElement && !rootElement.innerHTML) {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
      <ClerkProvider publishableKey={aKey}>
          <App />
      </ClerkProvider>

      )
    }
});



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log)
