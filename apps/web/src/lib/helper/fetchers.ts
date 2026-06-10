

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



async function getToken() {
  let token = "";
  if (typeof window !== 'undefined' && (window as any).Clerk?.session) {
    try {
      // Fetch a fresh token directly from the vanilla instance
      token = await (window as any).Clerk.session.getToken({ template: "api-jwt" });

      if (token) {
        token = `Bearer ${token}`;
        return token;
      }
    } catch (error) {
      console.error("Failed to fetch Clerk token outside component:", error);
    }
  }
}

export async function postTag(t: ITag) {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.updateTag}`;
  try {
    const token = await getToken();
    if (!token) {
      throw new AppError(genericError, 500);
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
      throw new AppError(payload?.message || genericError, res.status, rId, payload);
    }

    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(genericError, 0, undefined, { code, message: (e as Error).message });
  }
}

export async function postItem(item: IItem) {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.updateItem}`;
  try {
    const token = await getToken();
    if (!token) {
      throw new AppError(genericError, 500);
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
      throw new AppError(payload?.message || genericError, res.status, rId, payload);
    }

    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(genericError, 0, undefined, { code, message: (e as Error).message });
  }
}

export async function postFilter(f: IFilter) {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.updateFilter}`;
  try {
    const token = await getToken();
    if (!token) {
      throw new AppError(genericError, 500);
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
      throw new AppError(payload?.message || genericError, res.status, rId, payload);
    }
    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(genericError, 0, undefined, { code, message: (e as Error).message });
  }
}

export async function getItem(opts: IItemReadRequest): Promise<IItemReadResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.readItem}`;
  try {
    const token = await getToken();
    if (!token) {
      throw new AppError(genericError, 500);
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
      throw new AppError(payload?.message || genericError, res.status, rId, payload);
    }

    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(genericError, 0, undefined, { code, message: (e as Error).message });
  }
}


export async function getTag(opts: ITagReadRequest): Promise<ITagReadResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.readTag}`;
  try {
    const token = await getToken();
    if (!token) {
      throw new AppError(genericError, 500);
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
      throw new AppError(payload?.message || genericError, res.status, rId, payload);
    }

    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;
    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(genericError, 0, undefined, { code, message: (e as Error).message });
  }
}


export async function getTagProperty(opts: ITagReadRequest): Promise<ITagReadResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.readTagProperty}`;
  try {
    const token = await getToken();
    if (!token) {
      throw new AppError(genericError, 500);
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
      throw new AppError(payload?.message || genericError, res.status, rId, payload);
    }

    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(genericError, 0, undefined, { code, message: (e as Error).message });
  }
}

export async function getFilter(opts: IFilterReadRequest): Promise<IFilterReadResponse> {
  const url = `${window.runtimeConfig.apiUrl}/${ApiEndpoints.readFilter}`;

  try {
    const token = await getToken();
    if (!token) {
      throw new AppError(genericError, 500);
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
      throw new AppError(payload?.message || genericError, res.status, rId, payload);
    }

    return await res.json();
  } catch (e) {
    if (e instanceof AppError) throw e;

    // Catch browser level network dropouts ("Failed to fetch" / "NetworkError")
    throw new AppError(genericError, 0, undefined, { code, message: (e as Error).message });
  }
}
