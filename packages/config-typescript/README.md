# @repo/config-typescript

Shared TypeScript configurations for the React Masters monorepo.

## Configurations

### `base.json`

Base TypeScript configuration with strict type checking enabled. Includes:

- ✅ Strict mode enabled
- ✅ All strict checks (noUncheckedIndexedAccess, noImplicitOverride, etc.)
- ✅ ESNext module system
- ✅ Source maps and declaration maps
- ✅ Incremental compilation

**Use for**: Base configuration for all packages

### `nextjs.json`

Configuration optimized for Next.js applications. Extends `base.json` with:

- ✅ Next.js plugin support
- ✅ DOM and DOM.Iterable libs
- ✅ JSX preserve mode
- ✅ Path aliases (`@/*` and `@modules/*`)
- ✅ No emit (Next.js handles compilation)

**Use for**: Next.js applications (admin, web)

### `react-library.json`

Configuration for React component libraries and packages. Extends `base.json` with:

- ✅ React JSX transform
- ✅ Declaration files generation
- ✅ DOM types included
- ✅ Output to `dist/` directory

**Use for**: React component packages (ui, etc.)

### `node.json`

Configuration for Node.js packages and workers. Extends `base.json` with:

- ✅ CommonJS module system
- ✅ Node module resolution
- ✅ Node types included
- ✅ Output to `dist/` directory

**Use for**: Node.js packages (database, queue, workers, etc.)

## Usage

In your package's `tsconfig.json`, extend the appropriate configuration:

### For Next.js Apps

```json
{
  "extends": "@repo/config-typescript/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### For React Libraries

```json
{
  "extends": "@repo/config-typescript/react-library.json",
  "include": ["src"]
}
```

### For Node.js Packages

```json
{
  "extends": "@repo/config-typescript/node.json",
  "include": ["src"]
}
```

## Features

- 📦 Pre-configured for different project types
- 🔒 Strict type checking enabled by default
- ⚡ Optimized for monorepo setup
- 🎯 Path aliases support
- 📝 Declaration files generation
- 🗺️ Source maps for debugging
