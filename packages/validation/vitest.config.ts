import { defineConfig, mergeConfig } from 'vitest/config';
import nodeConfig from '@repo/config-vitest/node';

export default mergeConfig(
  nodeConfig,
  defineConfig({
    test: {
      include: ['test/**/*.test.ts'],
      coverage: {
        include: ['src/**/*.ts'],
        exclude: ['src/index.ts', 'src/types/**', 'src/messages.ts'],
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
