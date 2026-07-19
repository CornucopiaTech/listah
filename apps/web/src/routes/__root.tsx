import {
  createRootRoute,
} from '@tanstack/react-router';
import {
  Outlet,
} from '@tanstack/react-router';


import { AppShell } from '@/components/layout/AppContainer';
import {
  tagGroupOptions,
  filterGroupOptions,

} from '@/hooks/queries';
import {
  DefaultReadRequest,
} from "@/domain/entities";



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
  component: () => <AppShell><Outlet /></AppShell>,
})
