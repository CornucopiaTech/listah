
import { createContext, useContext } from "react";
import { DefaultQueryParams, } from '@/lib/helper/defaults';


export const SearchQueryContext = createContext(DefaultQueryParams);
export const useSearchQuery = () => useContext(SearchQueryContext);
