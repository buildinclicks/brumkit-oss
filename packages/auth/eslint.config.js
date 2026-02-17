import nodeConfig from '@repo/config-eslint/node';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...nodeConfig,
  {
    files: [
      'src/permissions/**/*.ts',
      'src/config/**/*.ts',
      'src/utils/**/*.ts',
    ],
    rules: {
      // CASL and NextAuth integration requires some any types due to library design
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
