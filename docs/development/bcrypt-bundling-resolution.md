# Complete bcrypt Bundling Issue - Resolution Summary

**Date**: 2026-01-13  
**Status**: ✅ **FULLY RESOLVED**  
**All 62 tests passing** ✅

---

## The Problem

Next.js was trying to bundle `bcrypt` (a native Node.js module with C++ bindings) into the Edge Runtime middleware, causing multiple errors.

---

## Root Causes (3 Issues Found & Fixed)

### Issue 1: Server Actions in Edge Runtime ❌

**Error**: `Cannot read properties of undefined (reading 'modules')`

**Cause**: Server actions were defaulting to Edge Runtime

**Solution**: Added `export const runtime = 'nodejs';` to:

- `apps/web/app/actions/auth.ts`
- `apps/web/app/actions/user.ts`

**Commit**: `8a03394`

---

### Issue 2: Middleware in Edge Runtime ❌

**Error**: `Cannot read properties of undefined (reading 'modules')` in middleware

**Cause**: Middleware runs in Edge Runtime by default in Next.js 13+

**Solution**: Added `export const runtime = 'nodejs';` to:

- `apps/web/middleware.ts`

**Commit**: `7df6558`

---

### Issue 3: Test Utilities Exported from Production Package ❌ ⚠️ **CRITICAL**

**Error**:

```
No native build was found for platform=win32 arch=x64 runtime=node
at (middleware)/../../packages/database/test/fixtures/index.ts
```

**Cause**:

- `packages/database/src/index.ts` was exporting test utilities:
  ```typescript
  export * from '../test/utils';
  export * from '../test/fixtures';
  ```
- Test utilities import `bcrypt` for creating test data
- Webpack bundled everything imported by middleware
- Result: bcrypt ended up in middleware bundle even with Node.js runtime

**Solution**:

1. **Removed** test utility exports from `packages/database/src/index.ts`
2. **Created** separate entry point: `packages/database/src/test.ts`
3. **Updated** `package.json` exports:
   ```json
   "exports": {
     ".": {
       "types": "./src/index.ts",
       "default": "./src/index.ts"
     },
     "./test": {
       "types": "./src/test.ts",
       "default": "./src/test.ts"
     }
   }
   ```

**Usage**:

- Production code: `import { db } from '@repo/database'`
- Test code: `import { createTestUser } from '@repo/database/test'`

**Commit**: `391165a`

---

## Why This Happened

### The Full Chain of Imports

```
middleware.ts
  → imports: auth from @repo/auth
    → imports: getCurrentUser from @repo/auth
      → imports: db from @repo/database
        → PREVIOUSLY exported: test/fixtures
          → imports: bcrypt (from devDependencies!)
            → BOOM! Native module in middleware bundle
```

### The Key Insight

Even with `runtime = 'nodejs'`, Webpack still tries to analyze and bundle ALL imports during build time. Test utilities with bcrypt were being included in the production bundle.

---

## All Fixes Applied

### 1. Runtime Declarations ✅

```typescript
// In server actions and middleware
export const runtime = 'nodejs';
```

### 2. Package Export Separation ✅

```json
{
  "exports": {
    ".": "./src/index.ts", // Production only
    "./test": "./src/test.ts" // Test utilities only
  }
}
```

### 3. Clean Production Exports ✅

```typescript
// packages/database/src/index.ts
// ✅ Only exports production code
export { prisma, db } from './client';
export type { User, Article, ... } from '@prisma/client';

// ❌ REMOVED:
// export * from '../test/utils';
// export * from '../test/fixtures';
```

---

## Verification

### Tests ✅

```bash
pnpm --filter web test
# Result: 62/62 tests passing
```

### Build ✅

```bash
pnpm --filter web build
# Result: ✓ Compiled successfully
# No bcrypt bundling warnings
```

### Browser ✅

- ✅ No Edge Runtime errors
- ✅ No bcrypt native module errors
- ✅ Middleware executes correctly
- ✅ Auth flow works end-to-end

---

## Key Learnings

### 1. **Test Utilities Should Never Be Exported from Production Packages**

❌ **Bad**:

```typescript
// src/index.ts
export * from '../test/utils'; // DON'T DO THIS!
```

✅ **Good**:

```typescript
// src/index.ts - production only
export { prodCode } from './prod';

// src/test.ts - test utilities
export * from '../test/utils';
```

### 2. **Webpack Bundles Everything It Can See**

Even with runtime declarations, Webpack analyzes imports at build time. If test code is exported, it will try to bundle it.

### 3. **Native Modules Require Extra Care**

Native Node.js modules like:

- `bcrypt`
- `sharp`
- `canvas`
- `sqlite3`

Must NEVER end up in Edge Runtime bundles, even accidentally through test code.

### 4. **Package Exports Field is Powerful**

Use `package.json` exports to explicitly control what can be imported:

```json
{
  "exports": {
    ".": "./production.ts",
    "./test": "./test.ts"
  }
}
```

This prevents accidental imports of test code in production.

---

## Commits

1. ✅ `8a03394` - fix(auth): force Node.js runtime for bcrypt compatibility
2. ✅ `7df6558` - fix(middleware): force Node.js runtime for bcrypt compatibility
3. ✅ `323be14` - docs: add comprehensive runtime compatibility fix documentation
4. ✅ `391165a` - fix(database): separate test utilities from production exports

---

## Impact

### Before Fixes ❌

- Browser: Runtime errors on every page load
- Middleware: Cannot execute
- Auth: Completely broken
- Development: Blocked

### After Fixes ✅

- Browser: Working perfectly
- Middleware: Executes correctly
- Auth: Full flow operational
- Development: Unblocked
- Tests: 62/62 passing
- Build: Clean compilation

---

## Monitoring & Prevention

### Going Forward

1. ✅ **Never export test utilities from production packages**
2. ✅ **Keep bcrypt in devDependencies only** (except @repo/auth which needs it)
3. ✅ **Use explicit package exports** to control import paths
4. ✅ **Test production builds** regularly to catch bundling issues
5. ✅ **Document runtime requirements** in each package

### If Adding New Native Modules

- Always check if they're Edge Runtime compatible
- If not, ensure they:
  1. Are only in devDependencies (if test-only)
  2. Have explicit runtime declarations (if production)
  3. Are not exported from packages that don't need them

---

## Files Changed

### Modified (5 files)

- `apps/web/app/actions/auth.ts` - Added runtime declaration
- `apps/web/app/actions/user.ts` - Added runtime declaration
- `apps/web/middleware.ts` - Added runtime declaration
- `packages/database/src/index.ts` - Removed test exports
- `packages/database/package.json` - Added explicit exports

### Created (2 files)

- `packages/database/src/test.ts` - Test utilities entry point
- `docs/development/runtime-compatibility-fix.md` - Full documentation

---

## Status: COMPLETE ✅

**Password Reset Flow**: Fully operational  
**All Tests**: 62/62 passing  
**Browser**: No errors  
**Production Ready**: Yes ✅

The bcrypt bundling nightmare is officially over! 🎉
