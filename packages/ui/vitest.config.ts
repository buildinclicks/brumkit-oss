import reactConfig from '@repo/config-vitest/react';
import react from '@vitejs/plugin-react';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  reactConfig,
  defineConfig({
    plugins: [react()],
    test: {
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['./vitest.setup.ts'],
      coverage: {
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/index.tsx',
          'src/**/*.stories.tsx',
          'src/**/*.d.ts',
          'src/components.css',
          'src/styles.css',
        ],
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
