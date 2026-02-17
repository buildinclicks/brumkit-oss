import { defineConfig } from 'vitest/config';

/**
 * Base Vitest Configuration
 *
 * Shared configuration for all packages in the monorepo.
 * Extend this in your package's vitest.config.ts.
 *
 * @example
 * ```ts
 * import { defineConfig, mergeConfig } from "vitest/config";
 * import baseConfig from "@repo/config-vitest/base";
 *
 * export default mergeConfig(
 *   baseConfig,
 *   defineConfig({
 *     test: {
 *       include: ["src/**\/*.test.ts"],
 *     },
 *   })
 * );
 * ```
 */
export default defineConfig({
  test: {
    // Test environment
    environment: 'node',

    // Global setup and teardown
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        '**/coverage/**',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
        '**/types/**',
        '**/__mocks__/**',
        '**/__fixtures__/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },

    // Test patterns
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/build/**',
      '**/.turbo/**',
    ],

    // Reporter configuration
    reporters: ['default'],

    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,

    // Watch mode
    watch: false,

    // Threads (updated for Vitest 4)
    pool: 'threads',

    // Mocking
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,

    // Silent mode
    silent: false,

    // Retry failed tests
    retry: 0,
  },
});
