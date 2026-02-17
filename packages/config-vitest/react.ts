import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './base.ts';

/**
 * React Vitest Configuration
 *
 * Configuration for testing React components.
 * Uses @testing-library/react and jsdom environment.
 *
 * @example
 * ```ts
 * import { defineConfig, mergeConfig } from "vitest/config";
 * import reactConfig from "@repo/config-vitest/react";
 *
 * export default mergeConfig(
 *   reactConfig,
 *   defineConfig({
 *     test: {
 *       include: ["src/**\/*.test.tsx"],
 *     },
 *   })
 * );
 * ```
 */
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      // Use jsdom for React component testing
      environment: 'jsdom',

      // Setup files for React testing
      setupFiles: ['./vitest.setup.ts'],

      // React-specific globals
      globals: true,

      // CSS handling
      css: {
        modules: {
          classNameStrategy: 'non-scoped',
        },
      },
    },

    // Resolve configuration for React
    resolve: {
      alias: {
        // Add common React testing aliases here if needed
      },
    },
  })
);
