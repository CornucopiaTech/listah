import {
  createFileRoute,
} from '@tanstack/react-router';
import { LinearProgress } from '@mui/material';

import { Home } from "@/components/pages/Home"

export const Route = createFileRoute('/')({
  component: Home,
  pendingComponent: LinearProgress,
})
