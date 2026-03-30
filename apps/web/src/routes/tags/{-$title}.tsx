import {
  createFileRoute,
} from '@tanstack/react-router';


import { Tags } from '@/components/pages/Tags';
import { LinearProgress } from '@mui/material';



export const Route = createFileRoute('/tags/{-$title}')({
  component: Tags,
  pendingComponent: LinearProgress,
})
