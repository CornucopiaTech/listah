import { createRootRoute, defer } from '@tanstack/react-router';
import LinearProgress from '@mui/material/LinearProgress';



import NotFound from '@/components/common/NotFound';
import { AppContainerShell } from '@/components/layout/AppContainer';
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
      const tags = context.queryClient.ensureQueryData(tagGroupOptions(query));
      const filters = context.queryClient.ensureQueryData(filterGroupOptions(query));
      return {
        tags: defer(tags), filters: defer(filters)
      }
      // const [tags] = await Promise.all([
      //   context.queryClient.ensureQueryData(tagGroupOptions(query)),
      // ]);
      // return { tags };
      // const [tags, props] = await Promise.all([
      //   context.queryClient.ensureQueryData(tagPropertyGroupOptions(query)),
      //   context.queryClient.ensureQueryData(tagGroupOptions(query)),
      // ]);
      // return { tags, props };
    }
    return null
  },
  component: AppContainerShell,
  notFoundComponent: NotFound,
  pendingComponent: LinearProgress,
})
