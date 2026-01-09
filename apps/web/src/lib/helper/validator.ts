
// import { ZItemsSearch } from '@/lib/model/Items';
import { decodeState } from '@/lib/helper/encoders';
import { DefaultQueryParams } from '@/lib/helper/defaults';


export function validateItemsUrlSearch(params: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!params || Object.keys(params).length === 0  || !params.s) {
    console.info("In validateItemQueryParams - using default");
    // return null;
    return DefaultQueryParams;
  }

  console.info("In validateItemQueryParams - Raw ");
  console.info(params);
  const dcd = decodeState(params.s);
  // const parsed = ZItemsSearch.safeParse(dcd);

  console.info("In validateItemQueryParams - Decoded ");
  console.info(dcd);
  return dcd;
  // console.info("In validateItemQueryParams - Parsed ");
  // console.info(parsed);
  // return parsed.data

}
