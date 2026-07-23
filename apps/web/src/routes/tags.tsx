
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
  type IReadRequest,
} from "@/domain/entities";




export const PrevRoute = createFileRoute('/tags')({
  // Ensure correct search parameters are passed down. Adds default value if no seach parameter is passed down.
  validateSearch: (search: Record<string, unknown>): { s: string } => {
    const s = search && search.s ? search.s : encodeState(DefaultReadRequest);
    return { s: s as unknown as string };
  },
  component: Tags,
})


export const Route = createFileRoute('/tags')({
  // Ensure correct search parameters are passed down. Adds default value if no seach parameter is passed down.
  validateSearch: (search: Record<string, unknown>): IReadRequest => {
    const s = search.query ? search as unknown as IReadRequest : DefaultReadRequest;
    console.info({ s, search, DefaultReadRequest })
    return { ...s };
  },
  component: Tags,
})
