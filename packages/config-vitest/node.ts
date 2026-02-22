import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './base.js';

/**
 * Node Vitest Configuration
 *
 * Configuration for testing Node.js code (utilities, APIs, backend logic).
 * Uses Node environment (no DOM).
 *
 * @example
 * ```ts
 * import { defineConfig, mergeConfig } from "vitest/config";
 * import nodeConfig from "@repo/config-vitest/node";
 *
 * export default mergeConfig(
 *   nodeConfig,
 *   defineConfig({
 *     test: {
 *       include: ["src/**\/*.test.ts"],
 *     },
 *   })
 * );
 * ```
 */
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      // Use Node environment for backend/utility testing
      environment: 'node',

      // Node-specific globals
      globals: true,

      // No CSS handling needed for Node
      css: false,
    },
  })
);
