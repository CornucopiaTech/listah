
// import { ZItemsSearch } from '@/lib/model/Items';
import { decodeState } from '@/lib/helper/encoders';
import { DefaultQueryParams } from '@/lib/helper/defaults';
import type { IItemsSearch } from '@/lib/model/item';



export function validateItemsUrlSearch(params: any): IItemsSearch { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!params || Object.keys(params).length === 0  || !params.s) {
    console.info("In validateItemQueryParams - using default");
    return DefaultQueryParams;
  }

  console.info("In validateItemQueryParams - Raw ");
  console.info(params);
  const dcd = decodeState(params.s);
  // const parsed = ZItemsSearch.safeParse(dcd);

  console.info("In validateItemQueryParams - Decoded ");
  console.info(dcd);
  return dcd as IItemsSearch;
  // console.info("In validateItemQueryParams - Parsed ");
  // console.info(parsed);
  // return parsed.data

}
