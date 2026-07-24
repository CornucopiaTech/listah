
import {
  createFileRoute,
} from '@tanstack/react-router';



import {
  Filters
} from "@/components/pages/Filters";
import {
  encodeState
} from '@/helpers/encoders';
import {
  DefaultReadRequest,
  type IUrlSearch,
} from "@/domain/entities";


export const Route = createFileRoute('/filters')({
  // Ensure correct search parameters are passed down. Adds default value if no seach parameter is passed down.
  validateSearch: (search: Record<string, unknown>): IUrlSearch => {
    const p = search && search.p ? search.p : encodeState(DefaultReadRequest);
    const c = search && search.c ? search.c : encodeState(DefaultReadRequest);
    return { p: p as unknown as string, c: c as unknown as string };
  },
  component: Filters,
})
