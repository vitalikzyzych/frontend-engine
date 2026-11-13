import { environmentManager, QueryClient } from '@tanstack/react-query';

import { isAppError } from '@/shared/lib/http/app-error';

const MAX_RETRIES = 2;

function shouldRetry(failureCount: number, error: unknown) {
  if (isAppError(error) && error.status >= 400 && error.status < 500) return false;
  return failureCount < MAX_RETRIES;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** A new client per server request, one shared client in the browser. */
export function getQueryClient() {
  if (environmentManager.isServer()) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
