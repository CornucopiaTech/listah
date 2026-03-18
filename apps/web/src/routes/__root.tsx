import { createRootRoute } from '@tanstack/react-router';




import NotFound from '@/components/common/NotFound';
import { AppContainerShell } from '@/components/layout/AppContainer';



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
  component: AppContainerShell,
  notFoundComponent: NotFound,
})
