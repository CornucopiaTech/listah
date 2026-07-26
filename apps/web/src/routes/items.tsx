
import {
  createFileRoute,
} from '@tanstack/react-router';



import {
  Tags
} from "@/components/pages/Tags";
import {
  encodeState
} from '@/helpers/encoders';
import {
  DefaultReadRequest,
  DefaultEditor,
  DefaultSearchReadRequest,
  type IUrlSearch,
} from "@/domain/entities";




export const Route = createFileRoute('/items')({
  // Ensure correct search parameters are passed down. Adds default value if no seach parameter is passed down.
  validateSearch: (search: Record<string, unknown>): IUrlSearch => {
    const p = search && search.p ? search.p : encodeState(DefaultReadRequest);
    const c = search && search.c ? search.c : encodeState(DefaultReadRequest);
    const e = search && search.e ? search.e : encodeState(DefaultEditor);
    const s = search && search.s ? search.s : encodeState(DefaultSearchReadRequest);
    return {
      p: p as unknown as string,
      c: c as unknown as string,
      e: e as unknown as string,
      s: s as unknown as string,
    };
  },
  component: Tags,
})
