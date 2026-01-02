import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router';


// Internal imports
import { HeroContainer } from '@/components/basics/Container';


export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  return <HeroContainer><Outlet /></HeroContainer>
}
