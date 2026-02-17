/**
 * Custom Render Utilities for React Testing Library
 *
 * Provides renderWithProviders that wraps components with all necessary providers:
 * - NextIntlClientProvider (i18n)
 * - QueryClientProvider (Tanstack Query)
 * - ThemeProvider (next-themes)
 *
 * Usage:
 * ```tsx
 * import { renderWithProviders, screen } from '@/lib/test';
 *
 * renderWithProviders(<MyComponent />);
 * expect(screen.getByRole('button')).toBeInTheDocument();
 * ```
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';

import type { ReactElement, ReactNode } from 'react';

import messages from '@/messages/en.json';

// Import English messages for testing

/**
 * Custom render options
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Custom locale (defaults to 'en')
   */
  locale?: string;

  /**
   * Custom messages (defaults to English)
   */
  messages?: Record<string, unknown>;

  /**
   * Custom QueryClient instance
   * If not provided, creates a new one with no retry and no cache
   */
  queryClient?: QueryClient;

  /**
   * Initial theme (defaults to 'light')
   */
  theme?: 'light' | 'dark' | 'system';

  /**
   * Disable theme provider (for components that don't need theming)
   */
  disableTheme?: boolean;
}

/**
 * Creates a test QueryClient with sensible defaults for testing
 * - No retries (tests should be deterministic)
 * - No cache time (each test starts fresh)
 * - No window focus refetching
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Wrapper component that provides all necessary context providers
 */
function AllTheProviders({
  children,
  locale = 'en',
  messages: customMessages = messages,
  queryClient,
  theme = 'light',
  disableTheme = false,
}: {
  children: ReactNode;
  locale?: string;
  messages?: Record<string, unknown>;
  queryClient: QueryClient;
  theme?: 'light' | 'dark' | 'system';
  disableTheme?: boolean;
}) {
  const content = (
    <NextIntlClientProvider locale={locale} messages={customMessages}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextIntlClientProvider>
  );

  if (disableTheme) {
    return content;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem
      disableTransitionOnChange
    >
      {content}
    </ThemeProvider>
  );
}

/**
 * Custom render function that wraps components with all necessary providers
 *
 * @example
 * ```tsx
 * // Basic usage
 * renderWithProviders(<MyComponent />);
 *
 * // With custom query client
 * const queryClient = createTestQueryClient();
 * renderWithProviders(<MyComponent />, { queryClient });
 *
 * // With dark theme
 * renderWithProviders(<MyComponent />, { theme: 'dark' });
 *
 * // Without theme provider
 * renderWithProviders(<MyComponent />, { disableTheme: true });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    locale = 'en',
    messages: customMessages = messages,
    queryClient,
    theme = 'light',
    disableTheme = false,
    ...renderOptions
  }: CustomRenderOptions = {}
): ReturnType<typeof render> & { queryClient: QueryClient } {
  const testQueryClient = queryClient ?? createTestQueryClient();

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AllTheProviders
      locale={locale}
      messages={customMessages}
      queryClient={testQueryClient}
      theme={theme}
      disableTheme={disableTheme}
    >
      {children}
    </AllTheProviders>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient: testQueryClient,
  };
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
