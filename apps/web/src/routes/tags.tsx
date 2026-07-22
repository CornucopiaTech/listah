
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
} from "@/domain/entities";




export const Route = createFileRoute('/tags')({
  // Ensure correct search parameters are passed down. Adds default value if no seach parameter is passed down.
  validateSearch: (search: Record<string, unknown>): { s: string } => {
    const s = search && search.s ? search.s : encodeState(DefaultReadRequest);
    return { s: s as unknown as string };
  },
  component: Tags,
})
