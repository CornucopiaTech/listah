// utils/encoders.ts
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent
} from "lz-string";

export function encodeState<T>(state: T): string {
  return compressToEncodedURIComponent(JSON.stringify(state));
}

export function decodeState(encoded: string | null): unknown | null {
  if (!encoded) return null;
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    console.info("Decoded State JSON - json");
    console.info(json);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}
