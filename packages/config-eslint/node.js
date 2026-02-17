import baseConfig from './base.js';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        // Node.js globals
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        console: 'readonly',
        exports: 'writable',
        global: 'readonly',
        module: 'readonly',
        process: 'readonly',
        require: 'readonly',
        setImmediate: 'readonly',
        setInterval: 'readonly',
        setTimeout: 'readonly',
        clearImmediate: 'readonly',
        clearInterval: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    rules: {
      // Node.js specific rules
      'no-process-exit': 'error',
      'no-sync': 'warn',

      // Console is allowed in Node.js
      'no-console': 'off',
    },
  },
];
