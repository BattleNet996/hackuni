type CacheEntry<T> = {
  data?: T;
  promise?: Promise<T>;
  expiresAt: number;
};

const DEFAULT_TTL_MS = 5 * 60 * 1000;
const jsonCache = new Map<string, CacheEntry<unknown>>();

export function getCachedJson<T>(key: string): T | null {
  const entry = jsonCache.get(key);
  if (!entry || typeof entry.data === 'undefined') {
    return null;
  }

  return entry.data as T;
}

export function primeJsonCache<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS) {
  jsonCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

export async function fetchJsonWithCache<T>(
  key: string,
  options: {
    ttlMs?: number;
    force?: boolean;
    init?: RequestInit;
  } = {}
): Promise<T> {
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const current = jsonCache.get(key);
  const isFresh = !!current && typeof current.data !== 'undefined' && current.expiresAt > Date.now();

  if (!options.force && isFresh) {
    return current.data as T;
  }

  if (!options.force && current?.promise) {
    return current.promise as Promise<T>;
  }

  const promise = fetch(key, {
    ...options.init,
    credentials: options.init?.credentials ?? 'include',
  })
    .then(async (response) => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || `Request failed: ${response.status}`);
      }

      primeJsonCache(key, data, ttlMs);
      return data as T;
    })
    .catch((error) => {
      const fallback = jsonCache.get(key);
      if (!fallback?.data) {
        jsonCache.delete(key);
      }
      throw error;
    });

  jsonCache.set(key, {
    data: current?.data,
    promise,
    expiresAt: current?.expiresAt ?? 0,
  });

  return promise;
}

export function prefetchJsonWithCache<T>(
  key: string,
  options?: {
    ttlMs?: number;
    force?: boolean;
    init?: RequestInit;
  }
) {
  void fetchJsonWithCache<T>(key, options).catch(() => {});
}

export function clearJsonCache(key: string) {
  jsonCache.delete(key);
}

export function clearJsonCacheByPrefix(prefix: string) {
  Array.from(jsonCache.keys()).forEach((key) => {
    if (key.startsWith(prefix)) {
      jsonCache.delete(key);
    }
  });
}
