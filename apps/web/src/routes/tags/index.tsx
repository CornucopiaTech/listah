
import {
  createFileRoute,
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




import { Tags } from "@/components/pages/Tags";
import {
  decodeState,
  encodeState
} from '@/lib/helper/encoders';
import {
  DefaultTagRead,
} from '@/lib/helper/defaults';
import type {
  ITagReadRequest,
} from "@/lib/model/tag";
import {
  ZTagReadRequest,
} from "@/lib/model/tag";

import { tagGroupOptions } from '@/lib/helper/querying';




// export const Route = createFileRoute('/tags/')({
//   component: () => <AppContainer mw="md">
//     <AppPagePaper key="tags">
//       <div> Hello World!</div>
//     </AppPagePaper>
//   </AppContainer >,
//   // Ensure correct search parameters are passed down. Adds default value if no seach parameter is passed down.
//   validateSearch: (search: Record<string, unknown>): { s: string } => {
//     const s = search && search.s ? decodeState(search.s as string) as ITagReadRequest : DefaultTagRead;
//     const q = {
//       ...s,
//       pagination: {
//         ...s.pagination,
//         pageNumber: s.pagination.pageNumber ? s.pagination.pageNumber : DefaultTagRead.pagination.pageNumber
//       }
//     }
//     return { s: encodeState(q) };
//   },
//   // Include the user context into to the search parameters. This neww search parameter gets added to the context object that is available to the loader.
//   beforeLoad: ({ context, search, location }: { context: any, search: any, location: any }) => {

//     console.log('In before load - ', search);
//     const ds = decodeState(search.s as string) as ITagReadRequest;
//     const s = { ...ds, userId: context.user?.id || "" }
//     return { ...context, tagSearch: s }
//   },
//   // Pass dependencies to the loader function. This does not inherit any changes made by beforeLoad. This is added just to keep track of the route dependency on the search parameters. loaderDeps drives when the loader re-runs.
//   loaderDeps: ({ search }: { search: { s: string } }) => {
//     return { q: search };
//   },
//   // Execute loader.
//   loader: ({ context }: { context: any }) => {
//     // Since the search parameter in loaderDeps does not contain userinformation, it will not be used in the loader.
//     context.queryClient.ensureQueryData(tagGroupOptions(context.tagSearch))
//   },
//   pendingComponent: LinearProgress,
// })


export const Route = createFileRoute('/tags/')({
  // Ensure correct search parameters are passed down. Adds default value if no seach parameter is passed down.
  validateSearch: (search) => ZTagReadRequest.parse(search),
  // validateSearch: (search: Record<string, unknown>): { s: string } => {
  //   const s = search && search.s ? decodeState(search.s as string) as ITagReadRequest : DefaultTagRead;
  //   const q = {
  //     ...s,
  //     pagination: {
  //       ...s.pagination,
  //       pageNumber: s.pagination.pageNumber ? s.pagination.pageNumber : DefaultTagRead.pagination.pageNumber
  //     }
  //   }
  //   return { s: encodeState(q) };
  // },
  // Include the user context into to the search parameters.This neww search parameter gets added to the context object that is available to the loader.
  beforeLoad: ({ context, search }: { context: any, search: any }) => {
    const ds = decodeState(search.s as string) as ITagReadRequest;
    const s = { ...ds, userId: context.user?.id || undefined }
    return { ...context, search: s }
  },
  // Pass dependencies to the loader function. This does not inherit any changes made by beforeLoad. This is added just to keep track of the route dependency on the search parameters. loaderDeps drives when the loader re-runs.
  loaderDeps: ({ search }: { search: { s: string } }) => {
    // return { search };
    return JSON.stringify(search.s);
  },
  // Execute loader.
  loader: ({ context }: { context: any }) => {
    // Since the search parameter in loaderDeps does not contain userinformation, it will not be used in the loader.
    if (context.user && context.search.userId != "" && context.search.userId != undefined) {
      return context.queryClient.ensureQueryData(tagGroupOptions(context.search))
    }
    return null
  },
  component: Page,
  pendingComponent: LinearProgress,
})

function Page() {
  const { search: query } = Route.useRouteContext();
  console.info('In TagList Page - query', query)

  if (query.userId != "" && query.userId !== null && query.userId !== undefined) {
    return <Tags />
  }
  return <LinearProgress />
}
