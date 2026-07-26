
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
  component: RootComponent,
  pendingComponent: () => <AppShell> <LinearProgress /></AppShell>,
})
