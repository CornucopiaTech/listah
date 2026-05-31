

import type {
  IItemReadRequest,
  IItem,
  IItemReadResponse,
} from '@/lib/model/item';
import type {
  ITag,
  ITagReadRequest,
  ITagReadResponse
} from '@/lib/model/tag';
import type {
  IFilter,
  IFilterReadRequest,
  IFilterReadResponse
} from '@/lib/model/filter';

import { ApiEndpoints } from '@/lib/helper/defaults';
import { AppError, type BackendErrorPayload } from "@/lib/model/common";


const genericError = "An unexpected error occurred. Please try again later";
const code = "NETWORK_DISCONNECTED";

export async function postTag(t: ITag) {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.updateTag}`;
  try {
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify({ tags: [t] }),
      headers: { "Content-Type": "application/json", "Accept": "*/*", },
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
      throw new AppError(payload?.message || genericError, res.status, payload);
    }

    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(genericError, 0, { code, message: (e as Error).message });
  }
}

export async function postItem(item: IItem) {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.updateItem}`;
  try {
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify({ items: [item] }),
      headers: { "Content-Type": "application/json", "Accept": "*/*", },
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

      throw new AppError(payload?.message || genericError, res.status, payload);
    }

    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(genericError, 0, { code, message: (e as Error).message });
  }
}

export async function postFilter(f: IFilter) {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.updateFilter}`;
  try {
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify({ filters: [f] }),
      headers: { "Content-Type": "application/json", "Accept": "*/*", },
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
      throw new AppError(payload?.message || genericError, res.status, payload);
    }
    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(genericError, 0, { code, message: (e as Error).message });
  }
}

export async function getItem(opts: IItemReadRequest): Promise<IItemReadResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.readItem}`;
  try {
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(opts),
      headers: { "Content-Type": "application/json", "Accept": "*/*" },
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
      throw new AppError(payload?.message || genericError, res.status, payload);
    }

    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(genericError, 0, { code, message: (e as Error).message });
  }
}


export async function getTag(opts: ITagReadRequest): Promise<ITagReadResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.readTag}`;
  try {
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(opts),
      headers: { "Content-Type": "application/json", "Accept": "*/*" },
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

      throw new AppError(payload?.message || genericError, res.status, payload);
    }

    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;
    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(genericError, 0, { code, message: (e as Error).message });
  }
}


export async function getTagProperty(opts: ITagReadRequest): Promise<ITagReadResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.readTagProperty}`;
  try {
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(opts),
      headers: { "Content-Type": "application/json", "Accept": "*/*" },
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

      throw new AppError(payload?.message || genericError, res.status, payload);
    }

    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(genericError, 0, { code, message: (e as Error).message });
  }
}

export async function getFilter(opts: IFilterReadRequest): Promise<IFilterReadResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.readFilter}`;

  try {
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify(opts),
      headers: { "Content-Type": "application/json", "Accept": "*/*" },
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

      throw new AppError(payload?.message || genericError, res.status, payload);
    }

    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(genericError, 0, { code, message: (e as Error).message });
  }
}
