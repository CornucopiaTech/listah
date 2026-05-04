import {
  createFileRoute,
  redirect,
} from '@tanstack/react-router';
import { LinearProgress } from '@mui/material';


export const Route = createFileRoute('/')({
  pendingComponent: LinearProgress,
  beforeLoad: () => {
    throw redirect({
      to: '/tags',
      replace: true, // This option makes it a "permanent" history change
    })
  },
})
