import {
  createFileRoute,
  redirect,
} from '@tanstack/react-router';
import { LinearProgress } from '@mui/material';

import { Fragment } from "react";


import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { TagListLayout } from "@/components/layout/TagList";
import { AppTagModal } from "@/components/core/AppTagModal";
import { AppFilterModal } from "@/components/core/AppFilterModal";
import {
  AppPagePaper,
} from '@/components/core/AppPaper';
import { AppContainer } from '@/components/layout/AppContainer';
import {
  MenuItem,
} from '@/components/base/Menubar';
import {
  AppListItemTypography,
} from "@/components/core/Typography";


import {
  DefaultTagRead,
} from '@/lib/helper/defaults';
import {
  encodeState
} from '@/lib/helper/encoders';




export const Route = createFileRoute('/')({
  pendingComponent: LinearProgress,
  // component: () =>
  component: () => <AppContainer mw="md">
    <AppPagePaper key="tags">
      <div> Hello World!</div>
    </AppPagePaper>
  </AppContainer >
  // beforeLoad: () => {
  //   throw redirect({
  //     to: '/tags',
  //     from: '/',
  //     search: { s: encodeState(DefaultTagRead) },
  //     replace: true, // This option makes it a "permanent" history change
  //   })
  // },
})
