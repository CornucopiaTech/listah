import { createRootRoute } from '@tanstack/react-router';
import LinearProgress from '@mui/material/LinearProgress';



import NotFound from '@/components/common/NotFound';
import { AppContainerShell } from '@/components/layout/AppContainer';
import { tagGroupOptions } from '@/lib/helper/querying';
import {
  DefaultTagRead,
} from '@/lib/helper/defaults';



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
  loader: ({ context }: { context: any }) => {
    // Since the search parameter in loaderDeps does not contain userinformation, it will not be used in the loader.
    if (context.user) {
      const query = {
        ...DefaultTagRead,
        userId: context.user.id,
        pagination: { ...DefaultTagRead.pagination, pageSize: -1 }
      }
      return context.queryClient.ensureQueryData(tagGroupOptions(query))
    }
    return null
  },
  component: AppContainerShell,
  notFoundComponent: NotFound,
  pendingComponent: LinearProgress,
  // ToDo: Add loader for all tags to be prefetched.
})
