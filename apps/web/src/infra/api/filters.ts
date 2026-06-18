


import type {
  IFilter,
  IReadRequest,
  IFilterReadResponse,
  BackendErrorPayload,
} from '@/domain/entities';
import {
  AppError,
  ApiEndpoints,
} from "@/domain/entities";
import {
  getToken,
  GenericCode,
  GenericError
} from '@/infra/api/auth';




export async function postFilter(f: IFilter) {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.updateFilter}`;
  try {
    const token = await getToken();
    if (!token) {
      throw new AppError(GenericError, 500);
    }
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify({ filters: [f] }),
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

export async function getFilter(opts: IReadRequest): Promise<IFilterReadResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.readFilter}`;
  console.info('readFilter', opts)

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

    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(GenericError, 0, undefined, { code: GenericCode, message: (e as Error).message });
  }
}
