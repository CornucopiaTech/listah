
import {
  createFileRoute,
} from '@tanstack/react-router';
import { LinearProgress } from '@mui/material';


import { Filters } from "@/components/pages/Filters";
import {
  decodeState,
  encodeState
} from '@/utils/encoders';
import {
  DefaultFilterRead,
} from '@/utils/defaults';
import type {
  IFilterReadRequest,
} from "@/entities/filter";
import { filterGroupOptions } from '@/utils/querying';


export const Route = createFileRoute('/filters')({
  // Ensure correct search parameters are passed down. Adds default value if no seach parameter is passed down.
  validateSearch: (search: Record<string, unknown>): { s: string } => {
    const s = search && search.s ? decodeState(search.s as string) as IFilterReadRequest : DefaultFilterRead;
    const pgN = s.pagination ? {
      ...s.pagination,
      pageNumber: s.pagination.pageNumber ? s.pagination.pageNumber : DefaultFilterRead.pagination.pageNumber
    } : DefaultFilterRead.pagination;
    const q = { ...s, pagination: pgN };
    return { s: encodeState(q) };
  },
  //// Include the user context into to the search parameters.This neww search parameter gets added to the context object that is available to the loader.
  beforeLoad: ({ context, search }: { context: any, search: any }) => {
    const ds = decodeState(search.s as string) as IFilterReadRequest;
    const s = { ...ds, userId: context.user?.id || undefined }
    return { ...context, search: s }
  },
  // Pass dependencies to the loader function. This does not inherit any changes made by beforeLoad. This is added just to keep track of the route dependency on the search parameters. loaderDeps drives when the loader re-runs. So when the search parameter changes, then the loader will re-run.
  loaderDeps: ({ search }: { search: Record<string, unknown> }) => {
    return { search };
  },
  // Execute loader.
  loader: ({ context }: { context: any }) => {
    // Since the search parameter in loaderDeps does not contain userinformation, it will not be used in the loader.
    if (context.user && context.search.userId != "" && context.search.userId != undefined) {
      return context.queryClient.ensureQueryData(filterGroupOptions(context.search))
    }
    return null
  },
  component: Page,
  pendingComponent: LinearProgress,
})

function Page() {
  const { search: query } = Route.useRouteContext();
  if (query.userId != "" && query.userId !== null && query.userId !== undefined) {
    return <Filters />
  }
  return <LinearProgress />
}
