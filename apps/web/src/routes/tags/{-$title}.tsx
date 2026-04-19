import {
  createFileRoute,
} from '@tanstack/react-router';
import { LinearProgress } from '@mui/material';


import { Tags } from '@/components/pages/Tags';




export const Route = createFileRoute('/tags/{-$title}')({
  component: Tags,
  pendingComponent: LinearProgress,
})
