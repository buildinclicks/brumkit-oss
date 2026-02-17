import { defineConfig, mergeConfig } from 'vitest/config';
import { baseConfig } from '@repo/config-vitest/node';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      // Auth-specific test configuration
    },
  })
);
