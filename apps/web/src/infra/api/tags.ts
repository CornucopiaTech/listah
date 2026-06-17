


import type {
  ITag,
  ITagReadRequest,
  ITagReadResponse,
  ITagPropertyReadRequest,
  ITagPropertyReadResponse,
} from '@/domain/entities/tag';
import {
  // ZTagReadResponse,
  ZTagPropertyReadResponse,
} from "@/domain/entities/tag";
import { ApiEndpoints } from '@/utils/defaults';
import { AppError, type BackendErrorPayload } from "@/domain/entities/common";
import { getToken, GenericCode, GenericError } from '@/infra/api/auth';






export async function postTag(t: ITag) {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.updateTag}`;
  try {
    const token = await getToken();
    if (!token) {
      throw new AppError(GenericError, 500);
    }
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify({ tags: [t] }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Authorization": token,
      },
    });
    const res = await fetch(req);

    if (!res.ok) {
      let payload: BackendErrorPayload | undefined;
      try {
        payload = await res.json();
        console.info('payloa', payload)
      } catch {
        // Response wasn't JSON (e.g., gateway crash)
      }
      const rId: string | null = res.headers.get("X-Request-Id");
      throw new AppError(payload?.message || GenericError, res.status, rId, payload);
    }

    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(GenericError, 0, undefined, { code: GenericCode, message: (e as Error).message });
  }
}

export async function getTag(opts: ITagReadRequest): Promise<ITagReadResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.readTag}`;
  try {
    const token = await getToken();
    if (!token) {
      throw new AppError(GenericError, 500);
    }
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(opts),
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Authorization": token,
      },
    });
    const res = await fetch(req);
    if (!res.ok) {
      let payload: BackendErrorPayload | undefined;
      try {
        payload = await res.json();
        console.info('payloa', payload)
      } catch {
        // Response wasn't JSON (e.g., gateway crash)
      }

      const rId: string | null = res.headers.get("X-Request-Id");
      throw new AppError(payload?.message || GenericError, res.status, rId, payload);
    }
    const data = await res.json();
    // return ZTagReadResponse.parse(data);
    return data;

  } catch (e) {
    if (e instanceof AppError) throw e;
    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(GenericError, 0, undefined, { code: GenericCode, message: (e as Error).message });
  }
}


export async function getTagProperty(opts: ITagPropertyReadRequest): Promise<ITagPropertyReadResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.readTagProperty}`;
  try {
    const token = await getToken();
    if (!token) {
      throw new AppError(GenericError, 500);
    }
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(opts),
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Authorization": token,
      },
    });
    const res = await fetch(req);
    if (!res.ok) {
      let payload: BackendErrorPayload | undefined;
      try {
        payload = await res.json();
        console.info('payloa', payload)
      } catch {
        // Response wasn't JSON (e.g., gateway crash)
      }
      const rId: string | null = res.headers.get("X-Request-Id");
      throw new AppError(payload?.message || GenericError, res.status, rId, payload);
    }

    const data = await res.json();
    return ZTagPropertyReadResponse.parse(data);
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(GenericError, 0, undefined, { code: GenericCode, message: (e as Error).message });
  }
}
