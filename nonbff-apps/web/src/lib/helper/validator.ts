
import { decodeState, } from '@/lib/helper/encoders';
import { DefaultItemRead } from '@/lib/helper/defaults';
import type { IItemReadRequest } from '@/lib/model/item';


export function setItemsUrlSearch(params: any): IItemReadRequest { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!params || Object.keys(params).length === 0 || !params.s) {
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.info("In validateItemQueryParams - using default");
    }
    return DefaultItemRead;
  }

  if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
    console.info("In validateItemQueryParams - Raw ");
    console.info(params);
  }
  const dcd = decodeState(params.s);
  // const parsed = ZItemsSearch.safeParse(dcd);

  if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
    console.info("In validateItemQueryParams - Decoded ");
    console.info(dcd);
  }
  return dcd as IItemReadRequest;
  // console.info("In validateItemQueryParams - Parsed ");
  // console.info(parsed);
  // return parsed.data

}


export function validateItemsUrlSearch(params: any): IItemReadRequest { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!params || Object.keys(params).length === 0 || !params.s) {
    return DefaultItemRead;
  }
  const dcd = decodeState(params.s);
  // const parsed = ZItemsSearch.safeParse(dcd);

  // console.info("In validateItemQueryParams - Decoded ");
  // console.info(dcd);
  return dcd as IItemReadRequest;
  // return parsed.data

}
