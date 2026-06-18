
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
  DefaultReadRequest,
  DefaultPagination,
} from "@/domain/entities";
import type {
  IReadRequest
} from "@/domain/entities";
import { itemGroupOptions } from '@/hooks/queries';



export const Route = createFileRoute('/items')({
  // Ensure correct search parameters are passed down. Adds default value if no seach parameter is passed down.
  validateSearch: (search: Record<string, unknown>): { s: string } => {
    const s = search && search.s ? decodeState(search.s as string) as IReadRequest : DefaultReadRequest;
    let pgn = s.pagination ? s.pagination : { ...DefaultPagination };
    pgn = { ...pgn, page: pgn.page ? pgn.page : DefaultPagination.page };
    const q = { ...s, pagination: pgn };
    return { s: encodeState(q) };
  },
  //// Include the user context into to the search parameters.This neww search parameter gets added to the context object that is available to the loader.
  beforeLoad: ({ context, search }: { context: any, search: any }) => {
    const ds = decodeState(search.s as string) as IReadRequest;
    const s = { ...ds, query: { ...ds.query, userId: context.user?.id } }
    return { ...context, search: s }
  },
  // Pass dependencies to the loader function. This does not inherit any changes made by beforeLoad. This is added just to keep track of the route dependency on the search parameters. loaderDeps drives when the loader re-runs.
  loaderDeps: ({ search }: { search: Record<string, unknown> }) => {
    return { search };
  },
  // Execute loader.
  loader: ({ context }: { context: any }) => {
    // Since the search parameter in loaderDeps does not contain userinformation, it will not be used in the loader.
    if (context.user && context.search.query.userId && context.search.query.userId != "") {
      const { query, pagination } = context.search;
      return context.queryClient.ensureQueryData(itemGroupOptions({ query, pagination }))
    }
    return null
  },
  component: Page,
  pendingComponent: LinearProgress,
})

function Page() {
  const { search } = Route.useRouteContext();
  const { query } = search;
  if (query.userId && query.userId != "") {
    return <Items />
  }
  return <LinearProgress />
}
