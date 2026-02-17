import { QueryClient } from '@tanstack/react-query';

import type { DefaultOptions } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    // Stale time: 5 minutes
    staleTime: 1000 * 60 * 5,
    // Cache time: 10 minutes
    gcTime: 1000 * 60 * 10,
    // Retry failed requests 1 time
    retry: 1,
    // Refetch on window focus in production
    refetchOnWindowFocus: process.env.NODE_ENV === 'production',
    // Refetch on reconnect
    refetchOnReconnect: true,
  },
  mutations: {
    // Retry failed mutations 0 times
    retry: 0,
  },
};

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
}

// Create a singleton instance for server-side
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new query client
    return createQueryClient();
  } else {
    // Browser: create once and reuse
    if (!browserQueryClient) {
      browserQueryClient = createQueryClient();
    }
    return browserQueryClient;
  }
}
