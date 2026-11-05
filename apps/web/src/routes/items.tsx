
import {
  createFileRoute,
} from '@tanstack/react-router';



import {
  Items
} from "@/components/";
import {
  getUrlSearch,
} from '@/helpers/encoders';
import {
  type IUrlSearch,
} from "@/app-types";




export const Route = createFileRoute('/items')({
  // Ensure correct search parameters are passed down. Adds default value if no seach parameter is passed down.
  validateSearch: (search: Record<string, unknown>): IUrlSearch => {
    return getUrlSearch(search) as unknown as IUrlSearch;
  },
  component: Items,
})
