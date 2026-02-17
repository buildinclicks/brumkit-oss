import { defineConfig, mergeConfig } from 'vitest/config';
import nodeConfig from './node.ts';

export default mergeConfig(
  nodeConfig,
  defineConfig({
    test: {
      include: ['test/**/*.test.ts'],
    },
  })
);
