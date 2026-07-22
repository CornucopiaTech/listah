
import {
  createFileRoute,
} from '@tanstack/react-router';
import LinearProgress from '@mui/material/LinearProgress';



import {
  FilterShell,
  Filters

} from "@/components/pages/Filters";
import {
  encodeState
} from '@/helpers/encoders';
import {
  DefaultReadRequest,
} from "@/domain/entities";
import {
  FilterListProvider
} from "@/hooks/context/filters";
import { AppShell } from '@/components/layout';


export const Route = createFileRoute('/filters')({
  // Ensure correct search parameters are passed down. Adds default value if no seach parameter is passed down.
  validateSearch: (search: Record<string, unknown>): { s: string } => {
    const s = search && search.s ? search.s : encodeState(DefaultReadRequest);
    return { s: s as unknown as string };
  },
  component: () => <FilterListProvider><FilterShell><Filters /></FilterShell></FilterListProvider>,
  pendingComponent: LinearProgress,
})
