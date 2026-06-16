import {
  createFileRoute,
  redirect,
} from '@tanstack/react-router';
import { LinearProgress } from '@mui/material';



import {
  DefaultTagRead,
} from '@/utils/defaults';
import {
  encodeState
} from '@/utils/encoders';




export const Route = createFileRoute('/')({
  pendingComponent: LinearProgress,
  beforeLoad: () => {
    throw redirect({
      to: '/tags',
      from: '/',
      search: { s: encodeState(DefaultTagRead) },
      replace: true, // This option makes it a "permanent" history change
    })
  },
})
