import {
  createFileRoute,
  redirect,
} from '@tanstack/react-router';
import { LinearProgress } from '@mui/material';


import {
  encodeState
} from '@/helpers/encoders';
import {
  DefaultReadRequest,
} from "@/domain/entities";



export const Route = createFileRoute('/')({
  pendingComponent: LinearProgress,
  beforeLoad: () => {
    throw redirect({
      to: '/tags',
      from: '/',
      replace: true, // This option makes it a "permanent" history change
    })
  },
})
