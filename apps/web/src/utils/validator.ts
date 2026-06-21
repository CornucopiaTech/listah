
import { decodeState, } from '@/utils/encoders';
import {
  type IReadRequest,
  DefaultReadRequest,
} from '@/domain/entities';


export function setItemsUrlSearch(params: any): IReadRequest { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!params || Object.keys(params).length === 0 || !params.s) {
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
    }
    return DefaultReadRequest;
  }

  if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
  }
  const dcd = decodeState(params.s);

  if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
  }
  return dcd as IReadRequest;

}


export function validateItemsUrlSearch(params: any): IReadRequest { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!params || Object.keys(params).length === 0 || !params.s) {
    return DefaultReadRequest;
  }
  const dcd = decodeState(params.s);
  return dcd as IReadRequest;
}
