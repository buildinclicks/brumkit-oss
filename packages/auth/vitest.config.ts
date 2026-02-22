import nodeConfig from '@repo/config-vitest/node';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  nodeConfig,
  defineConfig({
    test: {
      // Auth-specific test configuration
    },
  })
);
