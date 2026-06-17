

import type {
  IItemReadRequest,
  IItem,
  IItemReadResponse,
} from '@/domain/entities/item';
import {
  ZItemReadResponse,
} from "@/domain/entities/item";
import { ApiEndpoints } from '@/utils/defaults';
import { AppError, type BackendErrorPayload } from "@/domain/entities/common";
import { getToken, GenericCode, GenericError } from '@/infra/api/auth';


export async function postItem(item: IItem) {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.updateItem}`;
  try {
    const token = await getToken();
    if (!token) {
      throw new AppError(GenericError, 500);
    }
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify({ items: [item] }),
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


export async function getItem(opts: IItemReadRequest): Promise<IItemReadResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.readItem}`;
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

    // return await res.json();
    const data = await res.json();
    return ZItemReadResponse.parse(data);
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(GenericError, 0, undefined, { code: GenericCode, message: (e as Error).message });
  }
}
