
import {
  createFileRoute,
} from '@tanstack/react-router';
import { LinearProgress } from '@mui/material';

import { Items } from "@/components/pages/Items";
import {
  decodeState,
  encodeState
} from '@/utils/encoders';
import {
  DefaultItemRead,
  DefaultIItemRouteSearch,
} from '@/utils/defaults';
import type {
  IItemRouteSearch,
} from "@/domain/entities/item";
import { itemGroupOptions } from '@/utils/querying';



export const Route = createFileRoute('/items')({
  // Ensure correct search parameters are passed down. Adds default value if no seach parameter is passed down.
  validateSearch: (search: Record<string, unknown>): { s: string } => {
    const s = search && search.s ? decodeState(search.s as string) as IItemRouteSearch : DefaultIItemRouteSearch;
    const pgN = s.query && s.query.pagination ? {
      ...s.query.pagination,
      pageNumber: s.query.pagination.pageNumber ? s.query.pagination.pageNumber : DefaultItemRead.pagination.pageNumber
    } : DefaultItemRead.pagination
    const q = { ...s, query: { ...s.query, pagination: pgN } }
    return { s: encodeState(q) };
  },
  //// Include the user context into to the search parameters.This neww search parameter gets added to the context object that is available to the loader.
  beforeLoad: ({ context, search }: { context: any, search: any }) => {
    const ds = decodeState(search.s as string) as IItemRouteSearch;
    const s = { ...ds, query: { ...ds.query, userId: context.user?.id || undefined } };
    return { ...context, search: s }
  },
  // Pass dependencies to the loader function. This does not inherit any changes made by beforeLoad. This is added just to keep track of the route dependency on the search parameters. loaderDeps drives when the loader re-runs.
  loaderDeps: ({ search }: { search: Record<string, unknown> }) => {
    return { search };
  },
  // Execute loader.
  loader: ({ context }: { context: any }) => {
    // Since the search parameter in loaderDeps does not contain userinformation, it will not be used in the loader.
    if (context.user && context.search.query.userId != "" && context.search.query.userId != undefined) {
      return context.queryClient.ensureQueryData(itemGroupOptions(context.search.query))
    }
    return null
  },
  component: Page,
  pendingComponent: LinearProgress,
})

function Page() {
  const { search: query } = Route.useRouteContext();
  if (query.query.userId != "" && query.query.userId !== null && query.query.userId !== undefined) {
    return <Items />
  }
  return <LinearProgress />
}
