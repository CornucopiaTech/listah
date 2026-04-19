
import {
  createFileRoute,
} from '@tanstack/react-router';
import { LinearProgress } from '@mui/material';


import { Items } from "@/components/pages/Items";


export const Route = createFileRoute('/items/{-$title}')({
  component: Items,
  pendingComponent: LinearProgress,
})
