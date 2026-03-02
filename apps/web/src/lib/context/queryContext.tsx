
import { createContext, useContext } from "react";
import { DefaultQueryParams, DefaultHomeQueryParams } from '@/lib/helper/defaults';


export const ItemSearchQueryContext = createContext(DefaultQueryParams);
export const useItemSearchQuery = () => useContext(ItemSearchQueryContext);


export const HomeSearchQueryContext = createContext(DefaultHomeQueryParams);
export const useHomeSearchQuery = () => useContext(HomeSearchQueryContext);
