
import {
  createFileRoute,
} from '@tanstack/react-router';



import {
  Filters
} from "@/components/pages/Filters";
import {
  getUrlSearch,
} from '@/helpers/encoders';
import {
  type IUrlSearch,
} from "@/app-types";


export const Route = createFileRoute('/filters')({
  // Ensure correct search parameters are passed down. Adds default value if no seach parameter is passed down.
  validateSearch: (search: Record<string, unknown>): IUrlSearch => {
    return getUrlSearch(search) as unknown as IUrlSearch;
  },
  component: Filters,
})
