import { createFileRoute} from '@tanstack/react-router';



import { ListItems } from "@/pages/ListItems";
// import { Landing } from '@/pages/Landing';
// import { Home } from '@/pages/Home';


export const Route = createFileRoute('/')({
  // component: Landing,
  // component: Home,
  component: ListItems,
})


