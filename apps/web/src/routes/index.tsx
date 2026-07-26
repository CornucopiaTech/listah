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
  DefaultEditor,
  DefaultSearchReadRequest,
} from "@/domain/entities";



export const Route = createFileRoute('/')({
  pendingComponent: LinearProgress,
  beforeLoad: () => {
    const p = encodeState(DefaultReadRequest);
    const c = encodeState(DefaultReadRequest);
    const e = encodeState(DefaultEditor);
    const s = encodeState(DefaultSearchReadRequest);
    throw redirect({
      to: '/tags',
      search: {
        p: p as unknown as string,
        c: c as unknown as string,
        e: e as unknown as string,
        s: s as unknown as string,
      },
      replace: true, // This option makes it a "permanent" history change
    })
  },
})
