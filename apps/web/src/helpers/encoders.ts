// utils/encoders.ts
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent
} from "lz-string";



import {
  DefaultReadRequest,
  DefaultChildReadRequest,
  DefaultEditor,
  DefaultSearchReadRequest,
  type IUrlSearch,
} from "@/app-types";



export function encodeState<T>(state: T): string {
  return compressToEncodedURIComponent(JSON.stringify(state));
}

export function decodeState(encoded: string | null | undefined): unknown | null {
  if (!encoded) return null;
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export const DefaultUrlSearch = {
  p: encodeState(DefaultReadRequest) as unknown as string,
  c: encodeState(DefaultChildReadRequest) as unknown as string,
  e: encodeState(DefaultEditor) as unknown as string,
  s: encodeState(DefaultSearchReadRequest) as unknown as string,
}



export function getUrlSearch(search: Record<string, unknown>): IUrlSearch {
  return {
    p: (search.p || DefaultUrlSearch.p) as unknown as string,
    c: (search.c || DefaultUrlSearch.c) as unknown as string,
    e: (search.e || DefaultUrlSearch.e) as unknown as string,
    s: (search.s || DefaultUrlSearch.s) as unknown as string,
  };
}
