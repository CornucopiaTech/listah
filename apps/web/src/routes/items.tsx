
import {
  createFileRoute,
} from '@tanstack/react-router';



import {
  encodeState
} from '@/utils/encoders';
import {
  DefaultReadRequest,
} from "@/domain/entities";
import {
  Items,
  ItemShell
} from "@/components/pages/Items";
import {
  ItemListProvider
} from "@/hooks/context/items";


export const Route = createFileRoute('/items')({
  validateSearch: (search: Record<string, unknown>): { s: string } => {
    const s = search && search.s ? search.s : encodeState(DefaultReadRequest);
    return { s: s as unknown as string };
  },
  component: () => <ItemListProvider><ItemShell><Items /></ItemShell></ItemListProvider>,
})
