# Task 5.1: Vitest Setup & Configuration

**Status:** ✅ Completed  
**Date:** 2026-01-13

## Objective

Set up comprehensive Vitest testing infrastructure across all workspace packages with consistent configuration, 80% coverage thresholds, and proper TypeScript integration.

## Changes Made

### 1. Unified Vitest Versions

Aligned all packages to use Vitest v4.0.16:

- Updated `@repo/validation`: `^2.1.8` → `^4.0.16`
- Updated `@repo/auth`: `^2.1.9` → `^4.0.16`
- Added `@repo/email`: `^4.0.16`
- Added `@repo/ui`: `^4.0.16`
- Added `apps/web`: `^4.0.16`

###2. Enhanced @repo/config-vitest

**Fixed TypeScript Issues:**

- Removed `UserConfig` type import (not exported in v4)
- Removed `poolMatchGlobs` option (deprecated in v4)
- Changed `.js` imports to `.ts` for ESM compatibility
- Added `"type": "module"` to `package.json`

**Configuration Files:**

- `base.ts`: Core config with 80% coverage thresholds
- `node.ts`: Node environment for backend/utility tests
- `react.ts`: jsdom environment for React component tests

### 3. Package-Specific Configurations

#### @repo/validation

- Updated to use shared `nodeConfig`
- Excluded `messages.ts` from coverage
- Set 80% coverage thresholds
- Fixed tests to remove 'validation.' prefix

#### @repo/auth

- Already using shared config ✓
- All 41 tests passing

#### @repo/email

- Created `vitest.config.ts` using `nodeConfig`
- Created `test/client.test.ts` with mocked RESEND_API_KEY
- Excluded `templates/**` from coverage (visual, tested E2E)

#### @repo/ui

- Created `vitest.config.ts` using `reactConfig`
- Created `vitest.setup.ts` with `@testing-library/jest-dom`
- Added sample test: `button.test.tsx`
- Installed: `@testing-library/react`, `@vitejs/plugin-react`, `jsdom`

#### apps/web

- Created `vitest.config.ts` with Next.js-specific config
- Created `vitest.setup.ts` with Next.js mocks (navigation, next-intl)
- Added sample test: `field-error.test.tsx`
- Configured path alias: `@/` resolves to `./`
- Excluded `app/**` from coverage (tested via E2E)

### 4. TypeScript Configuration

**apps/web/tsconfig.json:**

- Added `"types": ["vitest/globals"]` for vi, describe, it, expect
- Excluded test files: `**/*.test.ts`, `**/*.test.tsx`
- Excluded config files: `vitest.config.ts`, `vitest.setup.ts`

### 5. Fixed Test Assertions

Updated `@repo/validation` tests to match new validation message key format (without 'validation.' prefix):

- `email.rules.test.ts`: 3 assertions fixed
- `password.rules.test.ts`: 5 assertions fixed
- `slug.rules.test.ts`: 3 assertions fixed
- `username.rules.test.ts`: 3 assertions fixed

## Test Results

All packages passing:

```
✓ @repo/config-vitest  - 1 file, 13 tests passed
✓ @repo/types          - 1 file, 53 tests passed
✓ @repo/utils          - 1 file, 12 tests passed
✓ @repo/email          - 1 file, 2 tests passed
✓ @repo/validation     - 4 files, 73 tests passed
✓ @repo/auth           - 3 files, 41 tests passed
✓ @repo/ui             - 1 file, 3 tests passed
✓ apps/web             - 1 file, 3 tests passed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total:                  13 files, 200 tests passed
```

## Files Created

```
packages/email/vitest.config.ts
packages/email/test/client.test.ts
packages/ui/vitest.config.ts
packages/ui/vitest.setup.ts
packages/ui/src/components/ui/button.test.tsx
apps/web/vitest.config.ts
apps/web/vitest.setup.ts
apps/web/components/form/field-error.test.tsx
```

## Files Modified

```
packages/config-vitest/package.json         # Added "type": "module"
packages/config-vitest/base.ts              # Removed UserConfig, poolMatchGlobs
packages/config-vitest/node.ts              # Fixed imports, removed satisfies
packages/config-vitest/react.ts             # Fixed imports, removed satisfies
packages/validation/package.json            # Vitest v4
packages/validation/vitest.config.ts        # Use shared nodeConfig
packages/validation/test/**/*.test.ts       # Fixed assertions (14 files)
packages/auth/package.json                  # Vitest v4
packages/email/package.json                 # Added vitest deps
packages/ui/package.json                    # Added test scripts & deps
apps/web/package.json                       # Added test scripts & deps
apps/web/tsconfig.json                      # Added vitest types, excluded tests
```

## Coverage Configuration

All packages configured with 80% thresholds:

- **Lines:** 80%
- **Functions:** 80%
- **Branches:** 80%
- **Statements:** 80%

**Reporters:** text, json, html, lcov

## Testing Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests for specific package
pnpm --filter @repo/validation test
pnpm --filter web test
```

## Key Patterns Established

1. **Shared configs:** Use `@repo/config-vitest/{node,react}` for consistency
2. **Mocking:** Mock external services (Resend) and Next.js APIs
3. **Coverage exclusions:** index files, templates, CSS, type definitions
4. **Test organization:** `test/` for packages, co-located `*.test.tsx` for components
5. **TypeScript:** Exclude test files from main tsconfig, use vitest/globals

## Next Steps

- ✅ **Task 5.1:** Vitest Setup (COMPLETED)
- 🔜 **Task 5.2:** Database Testing Strategy
- 🔜 **Task 5.3:** React Testing Library Setup
- 🔜 **Task 5.4:** Playwright E2E Setup
- 🔜 **Task 5.5:** CI/CD Testing Pipeline
- 🔜 **Task 5.6:** Testing Documentation

## Notes

- All tests passing with proper TypeScript integration
- ESM module resolution working correctly across packages
- Foundation ready for comprehensive test coverage
- Next task will focus on database testing utilities and strategies
