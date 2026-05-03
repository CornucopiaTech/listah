
import {
  createFileRoute,
} from '@tanstack/react-router';
import { LinearProgress } from '@mui/material';


import { Items } from "@/components/pages/Items";


export const Route = createFileRoute('/items/')({
  component: Items,
  pendingComponent: LinearProgress,
})
