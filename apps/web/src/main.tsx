import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { enableMapSet } from 'immer';



// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import Loading from '@/components/common/Loading';
import { ErrorAlerts } from '@/components/common/ErrorAlert';


enableMapSet();
export const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      <Loading />
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorAlerts> {error.message} </ErrorAlerts>,
  context: {
    auth: undefined!, // We'll inject this when we render
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

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    // <StrictMode>
    //   <RouterProvider router={router} />
    // </StrictMode>,
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        defaultPreload="intent"
        defaultPendingMs={0}
        defaultPendingMinMs={0}
        context={{
          queryClient,
        }}
      />
    </QueryClientProvider>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
