import { defineConfig, mergeConfig } from 'vitest/config';
import reactConfig from '@repo/config-vitest/react';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default mergeConfig(
  reactConfig,
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './'),
      },
    },
    test: {
      include: ['**/*.test.{ts,tsx}'],
      exclude: [
        '**/node_modules/**',
        '**/.next/**',
        '**/e2e/**', // E2E tests use Playwright
      ],
      setupFiles: ['./vitest.setup.ts'],
      // Disable file-level parallelism for database integration tests
      // This ensures tests that use the same test database don't interfere
      fileParallelism: false,
      coverage: {
        include: ['lib/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
        exclude: [
          '**/*.d.ts',
          '**/*.config.{js,ts}',
          '**/types/**',
          'app/**', // App Router pages tested via E2E
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
