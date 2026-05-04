
import {
  createFileRoute,
} from '@tanstack/react-router';
import { LinearProgress } from '@mui/material';


import { Filters } from "@/components/pages/Filters";


export const Route = createFileRoute('/filters/')({
  component: Filters,
  pendingComponent: LinearProgress,
})
