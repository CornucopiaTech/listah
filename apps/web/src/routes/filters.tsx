
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
  DefaultChildReadRequest,
  DefaultEditor,
  DefaultSearchReadRequest,
  type IUrlSearch,
} from "@/domain/entities";


export const Route = createFileRoute('/filters')({
  // Ensure correct search parameters are passed down. Adds default value if no seach parameter is passed down.
  validateSearch: (search: Record<string, unknown>): IUrlSearch => {
    const p = search && search.p ? search.p : encodeState(DefaultReadRequest);
    const c = search && search.c ? search.c : encodeState(DefaultChildReadRequest);
    const e = search && search.e ? search.e : encodeState(DefaultEditor);
    const s = search && search.s ? search.s : encodeState(DefaultSearchReadRequest);
    return {
      p: p as unknown as string,
      c: c as unknown as string,
      e: e as unknown as string,
      s: s as unknown as string,
    };
  },
  component: Filters,
})
