
import {
  createFileRoute,
} from '@tanstack/react-router';
import { LinearProgress } from '@mui/material';




import { Tags } from "@/components/pages/Tags";
import {
  decodeState,
  encodeState
} from '@/utils/encoders';
import type {
  IReadRequest,
} from "@/domain/entities";
import {
  DefaultReadRequest,
} from "@/domain/entities";
import { tagGroupOptions } from '@/hooks/queries';



export const Route = createFileRoute('/tags')({
  // Ensure correct search parameters are passed down. Adds default value if no seach parameter is passed down.
  validateSearch: (search: Record<string, unknown>): { s: string } => {
    const s = search && search.s ? decodeState(search.s as string) as IReadRequest : DefaultReadRequest;
    let pgn = s.pagination ? s.pagination : DefaultReadRequest.pagination;
    pgn = { ...pgn, page: pgn.page ? pgn.page : DefaultReadRequest.pagination.page };
    const q = { ...s, pagination: pgn };
    return { s: encodeState(q) };
  },
  //// Include the user context into to the search parameters.This neww search parameter gets added to the context object that is available to the loader.
  beforeLoad: ({ context, search }: { context: any, search: any }) => {
    const ds = decodeState(search.s as string) as IReadRequest;
    const s = { ...ds, query: { ...ds.query, userId: context.user?.id || undefined } }
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
      const { query, pagination } = context.search;
      return context.queryClient.ensureQueryData(tagGroupOptions({ query, pagination }))
    }
    return null
  },
  component: Page,
  pendingComponent: LinearProgress,
})

function Page() {
  const { search } = Route.useRouteContext();
  const { query } = search;
  if (query.userId != "" && query.userId !== null && query.userId !== undefined) {
    return <Tags />
  }
  return <LinearProgress />
}
