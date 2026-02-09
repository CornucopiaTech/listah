
import { createContext, useContext } from "react";
import { DefaultQueryParams, } from '@/lib/helper/defaults';


export const ItemSearchQueryContext = createContext(DefaultQueryParams);
export const useItemSearchQuery = () => useContext(ItemSearchQueryContext);
