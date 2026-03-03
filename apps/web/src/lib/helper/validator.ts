
// import { ZItemsSearch } from '@/lib/model/Items';
import { decodeState, encodeState } from '@/lib/helper/encoders';
import { DefaultQueryParams, DefaultHomeQueryParams } from '@/lib/helper/defaults';
import type { IItemReadRequest } from '@/lib/model/item';
import type {
  THomeQueryParams
} from '@/lib/model/home';


export function setItemsUrlSearch(params: any): IItemReadRequest { // eslint-disable-line @typescript-eslint/no-explicit-any
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
  return dcd as IItemReadRequest;
  // console.info("In validateItemQueryParams - Parsed ");
  // console.info(parsed);
  // return parsed.data

}


export function validateItemsUrlSearch(params: any): IItemReadRequest { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!params || Object.keys(params).length === 0  || !params.s) {
    return DefaultQueryParams;
  }
  const dcd = decodeState(params.s);
  // const parsed = ZItemsSearch.safeParse(dcd);

  // console.info("In validateItemQueryParams - Decoded ");
  // console.info(dcd);
  return dcd as IItemReadRequest;
  // return parsed.data

}



export function validateHomeUrlSearch(params: any): THomeQueryParams { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!params || Object.keys(params).length === 0  || !params.s) {
    console.info("In validateHomeUrlSearch - using default");
    return DefaultHomeQueryParams;
  }

  console.info("In validateHomeUrlSearch - Raw ");
  console.info(params);
  const dcd = decodeState(params.s);
  // const parsed = ZItemsSearch.safeParse(dcd);

  console.info("In validateHomeUrlSearch - Decoded ");
  console.info(dcd);
  return dcd as THomeQueryParams;
  // console.info("In validateItemQueryParams - Parsed ");
  // console.info(parsed);
  // return parsed.data

}


export function setHomeUrlSearch(params: any): string { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!params || Object.keys(params).length === 0  || !params.s) {
    console.info("In validateHomeUrlSearch - using default");
    return encodeState(DefaultHomeQueryParams) as unknown as string;
  }

  console.info("In validateHomeUrlSearch - Raw ");
  console.info(params);
  const dcd = decodeState(params.s);
  // const parsed = ZItemsSearch.safeParse(dcd);

  console.info("In validateHomeUrlSearch - Decoded ");
  console.info(dcd);
  return dcd as THomeQueryParams;
  // console.info("In validateItemQueryParams - Parsed ");
  // console.info(parsed);
  // return parsed.data

}
