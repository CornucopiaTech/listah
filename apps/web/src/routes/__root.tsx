import {
  Fragment,
} from 'react';
import {
  useUser
} from '@clerk/react';
import {
  createRootRoute,
} from '@tanstack/react-router';
import {
  Outlet,
} from '@tanstack/react-router';
import LinearProgress from '@mui/material/LinearProgress';



import {
  tagGroupOptions,
  filterGroupOptions,
} from '@/hooks/queries';
import {
  DefaultReadRequest,
} from "@/domain/entities";
import { Landing } from '@/components/pages/Landing';
import { AppShell } from '@/components/layout';



const RootComponent = () => {
  const { isSignedIn, isLoaded, } = useUser();
  if (!isLoaded) return <AppShell> <LinearProgress /></AppShell>
  if (!isSignedIn) return <AppShell><Landing /></AppShell>
  return <AppShell><Outlet /></AppShell>;
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
  // Execute loader.
  loader: async ({ context }: { context: any }) => {
    // Since the search parameter in loaderDeps does not contain userinformation, it will not be used in the loader.
    if (context.user) {
      const query = {
        ...DefaultReadRequest,
        query: { ...DefaultReadRequest.query, userId: context.user.id },
        pagination: { ...DefaultReadRequest.pagination, size: -1 }
      }
      context.queryClient.ensureQueryData(tagGroupOptions(query));
      context.queryClient.ensureQueryData(filterGroupOptions(query));
    }
    return null
  },
  component: RootComponent,
  pendingComponent: () => <AppShell> <LinearProgress /></AppShell>,
})
