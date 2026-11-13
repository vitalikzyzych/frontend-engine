import { type ZodType } from 'zod';

import { env } from '@/env';

import { AppError } from './app-error';

type QueryValue = string | number | boolean | null | undefined;

interface RequestOptions<T> extends Omit<RequestInit, 'body'> {
  query?: Record<string, QueryValue>;
  body?: unknown;
  /** Validates the response at runtime. Recommended for data the UI depends on. */
  schema?: ZodType<T>;
}

/**
 * Builds an absolute URL for an API path. Relative bases such as /api resolve against the
 * current origin in the browser; on the server NEXT_PUBLIC_API_URL must be absolute.
 */
export function apiUrl(path: string, query?: Record<string, QueryValue>): string {
  const base = env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  const origin = typeof window === 'undefined' ? undefined : window.location.origin;
  const url = new URL(`${base}/${path.replace(/^\/+/, '')}`, origin);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function buildHeaders(init: HeadersInit | undefined, hasBody: boolean) {
  const headers = new Headers(init);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (hasBody && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  return headers;
}

async function request<T>(path: string, options: RequestOptions<T> = {}): Promise<T> {
  const { query, body, schema, headers, ...init } = options;
  const hasBody = body !== undefined;

  let response: Response;
  try {
    response = await fetch(apiUrl(path, query), {
      credentials: 'include',
      ...init,
      headers: buildHeaders(headers, hasBody),
      body: hasBody ? JSON.stringify(body) : undefined,
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause;
    throw new AppError({ kind: 'network', status: 0, message: 'Network request failed', cause });
  }

  if (!response.ok) throw await AppError.fromResponse(response);
  if (response.status === 204) return undefined as T;

  let data: unknown;
  try {
    data = await response.json();
  } catch (cause) {
    throw new AppError({ kind: 'parse', status: response.status, message: 'Invalid JSON', cause });
  }

  if (!schema) return data as T;

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new AppError({
      kind: 'parse',
      status: response.status,
      message: `Unexpected response from ${path}`,
      cause: parsed.error,
    });
  }
  return parsed.data;
}

type MethodOptions<T> = Omit<RequestOptions<T>, 'method' | 'body'>;

export const http = {
  get: <T>(path: string, options?: MethodOptions<T>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: MethodOptions<T>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: MethodOptions<T>) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: MethodOptions<T>) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T = void>(path: string, options?: MethodOptions<T>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
