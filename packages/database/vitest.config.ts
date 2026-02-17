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
        exclude: ['src/index.ts', 'src/client.ts', 'src/test.ts'],
        // Database package uses integration tests which don't show up in coverage
        // The integration tests verify actual database operations are working
        enabled: false, // Disable coverage for database package
      },
    },
  })
);
