import { baseConfig } from '@repo/config-vitest/node';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      // Auth-specific test configuration
    },
  })
);
