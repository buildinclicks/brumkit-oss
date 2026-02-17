# @repo/config-eslint

Shared ESLint configurations for the React Masters monorepo with **strict rules**, **auto-fix** enabled, and **import sorting**.

## Configurations

### `base.js`

Base ESLint configuration for TypeScript projects.

**Features:**

- ✅ Strict TypeScript rules (@typescript-eslint/recommended)
- ✅ No `any` types allowed
- ✅ Unused variables error
- ✅ Consistent type imports
- ✅ Automatic import sorting and organization
- ✅ Prettier integration (no conflicts)

**Use for**: Base configuration for all TypeScript packages

### `nextjs.js`

Configuration optimized for Next.js applications.

**Features:**

- ✅ All base rules
- ✅ Next.js Core Web Vitals
- ✅ React and React Hooks rules
- ✅ Accessibility rules (jsx-a11y)
- ✅ Next.js specific optimizations

**Use for**: Next.js applications (admin, web)

### `react-library.js`

Configuration for React component libraries.

**Features:**

- ✅ All base rules
- ✅ React recommended rules
- ✅ React Hooks rules
- ✅ Accessibility rules (jsx-a11y)
- ✅ No unnecessary curly braces
- ✅ Boolean attributes optimization

**Use for**: React component packages (ui)

### `node.js`

Configuration for Node.js packages and workers.

**Features:**

- ✅ All base rules
- ✅ Node.js environment
- ✅ Console allowed
- ✅ No process.exit()
- ✅ Warns on sync operations

**Use for**: Node.js packages (database, queue, workers, etc.)

## Usage

### In Next.js Apps

Create `.eslintrc.js` in your app:

```javascript
module.exports = {
  root: true,
  extends: ['@repo/config-eslint/nextjs'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
```

### In React Libraries

Create `.eslintrc.js` in your package:

```javascript
module.exports = {
  root: true,
  extends: ['@repo/config-eslint/react-library'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
```

### In Node.js Packages

Create `.eslintrc.js` in your package:

```javascript
module.exports = {
  root: true,
  extends: ['@repo/config-eslint/node'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
```

## Features

### Import Sorting

Imports are automatically sorted into groups:

```typescript
// 1. Built-in modules
import fs from 'fs';
import path from 'path';

// 2. External modules
import React from 'react';
import { z } from 'zod';

// 3. Internal modules
import { something } from '@repo/utils';

// 4. Parent/sibling imports
import { Component } from '../components';

// 5. Type imports (at the end)
import type { User } from './types';
```

### Auto-fix

Many rules support auto-fix with `--fix`:

```bash
# Fix all auto-fixable issues
eslint --fix .
```

### Type-aware Linting

When `parserOptions.project` is configured, TypeScript type information is used for more accurate linting.

## Strict Rules

This configuration enforces strict rules:

- ❌ No `any` types
- ❌ No unused variables (prefix with `_` to allow)
- ❌ No `var` (use `const` or `let`)
- ❌ No `console.log` (only `console.warn` and `console.error` allowed)
- ❌ Must use `const` when variable is never reassigned
- ❌ React: Missing keys in lists
- ❌ React: Unstable nested components
- ❌ React: Missing alt text on images
- ❌ Node: No `process.exit()` (throw errors instead)

## IDE Integration

### VS Code

Install the ESLint extension and add to `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## Troubleshooting

### "Cannot find module '@repo/config-eslint'"

Make sure the package is installed:

```bash
pnpm add -D @repo/config-eslint
```

### "Parsing error: Cannot read file 'tsconfig.json'"

Ensure `parserOptions.project` and `parserOptions.tsconfigRootDir` are correctly set.

### Import plugin not resolving

Install the TypeScript resolver:

```bash
pnpm add -D eslint-import-resolver-typescript
```

## Dependencies

This package includes:

- `eslint` - Core linter
- `@typescript-eslint/parser` - TypeScript parser
- `@typescript-eslint/eslint-plugin` - TypeScript rules
- `eslint-plugin-import` - Import/export rules
- `eslint-plugin-react` - React rules
- `eslint-plugin-react-hooks` - React Hooks rules
- `eslint-plugin-jsx-a11y` - Accessibility rules
- `eslint-config-next` - Next.js rules
- `eslint-config-prettier` - Prettier integration
- `eslint-import-resolver-typescript` - TypeScript import resolution
