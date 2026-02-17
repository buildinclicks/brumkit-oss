import { defineConfig, mergeConfig } from 'vitest/config';
import nodeConfig from '@repo/config-vitest/node';

export default mergeConfig(
  nodeConfig,
  defineConfig({
    test: {
      include: ['test/**/*.test.ts'],
      // Use longer timeout for database operations
      testTimeout: 30000,
      hookTimeout: 30000,
      coverage: {
        include: ['src/**/*.ts'],
        exclude: ['src/index.ts'],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  })
);
