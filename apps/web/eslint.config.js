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
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      'lib/test/**/*',
      'vitest.setup.ts',
    ],
    rules: {
      // Test files can be more lenient
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/consistent-type-imports': 'off', // Dynamic imports in tests
      'import/order': 'warn', // Tests can have relaxed import order
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
    files: ['app/api/**/*', 'lib/services/**/*'],
    rules: {
      // API routes and services can use console for logging
      'no-console': 'warn',
    },
  },
];
