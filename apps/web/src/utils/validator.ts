
import { decodeState, } from '@/utils/encoders';
import {
  type IReadRequest,
  DefaultReadRequest,
} from '@/domain/entities';


export function setItemsUrlSearch(params: any): IReadRequest { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!params || Object.keys(params).length === 0 || !params.s) {
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.info("In validateItemQueryParams - using default");
    }
    return DefaultReadRequest;
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
  return dcd as IReadRequest;
  // console.info("In validateItemQueryParams - Parsed ");
  // console.info(parsed);
  // return parsed.data

}


export function validateItemsUrlSearch(params: any): IReadRequest { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!params || Object.keys(params).length === 0 || !params.s) {
    return DefaultReadRequest;
  }
  const dcd = decodeState(params.s);
  // const parsed = ZItemsSearch.safeParse(dcd);

  // console.info("In validateItemQueryParams - Decoded ");
  // console.info(dcd);
  return dcd as IReadRequest;
  // return parsed.data

}
