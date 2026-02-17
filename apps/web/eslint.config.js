import nextjsConfig from '@repo/config-eslint/nextjs';

export default [
  {
    ignores: [
      '.next/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts',
      'next-env.d.ts',
    ],
  },
  ...nextjsConfig,
  {
    files: ['app/api/**/*', 'lib/services/**/*'],
    rules: {
      // API routes and services can use console for logging
      'no-console': 'warn',
    },
  },
  {
    files: [
      'lib/**/*',
      'app/actions/**/*',
      'app/(dashboard)/**/*',
      'app/(auth)/**/*',
    ],
    rules: {
      // Utility, action, and page files may need any for flexibility
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/no-unescaped-entities': 'warn',
    },
  },
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      'lib/test/**/*',
      'vitest.setup.ts',
    ],
    rules: {
      // Test files can be more lenient - MUST come last to override everything
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/consistent-type-imports': 'off', // Dynamic imports in tests
      'import/order': 'off', // Tests can have relaxed import order
      'react/no-array-index-key': 'off', // Test data can use indices
    },
  },
];
