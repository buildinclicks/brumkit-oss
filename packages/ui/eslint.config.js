import reactLibraryConfig from '@repo/config-eslint/react-library';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...reactLibraryConfig,
  {
    rules: {
      // Allow React in scope for JSX
      'react/react-in-jsx-scope': 'off',
    },
  },
];
