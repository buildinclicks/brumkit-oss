/**
 * Vitest Setup File Template for React
 *
 * Copy this file to your React package as `vitest.setup.ts`
 * and customize as needed.
 *
 * @example
 * In your package:
 * 1. Copy this to `vitest.setup.ts`
 * 2. Reference it in your vitest.config.ts:
 *
 * ```ts
 * export default defineConfig({
 *   test: {
 *     setupFiles: ["./vitest.setup.ts"],
 *   },
 * });
 * ```
 */

import '@testing-library/jest-dom/vitest';

// Extend Vitest matchers with jest-dom
// This adds matchers like toBeInTheDocument(), toHaveClass(), etc.

// Mock window.matchMedia (commonly needed for React components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Mock IntersectionObserver (commonly needed for React components)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// Mock ResizeObserver (commonly needed for React components)
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// Add any global test setup here
// Example: Mock fetch, setup test database, etc.
