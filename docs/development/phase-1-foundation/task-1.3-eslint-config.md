# Task 1.3: Create ESLint Configuration Package

**Status**: ✅ Completed  
**Date**: 2026-01-11  
**Estimated Time**: 30-45 minutes  
**Actual Time**: 45 minutes

---

## 📋 Task Description

Create a shared ESLint configuration package (`@repo/config-eslint`) that provides base ESLint configs for all packages and applications in the monorepo. Configured with **strict rules**, **auto-fix** enabled, and **import sorting** as requested.

---

## ✅ What Was Implemented

### 1. Package Structure

Created `packages/config-eslint/` with the following structure:

```
packages/config-eslint/
├── base.js                 # Base config for TypeScript
├── nextjs.js               # Next.js specific config
├── react-library.js        # React component library config
├── node.js                 # Node.js/workers config
├── package.json
├── README.md               # Usage documentation
└── test/                   # Verification tests
    ├── base.test.ts
    ├── nextjs.test.tsx
    ├── react-library.test.tsx
    ├── node.test.ts
    ├── tsconfig.json
    └── eslint.config.base.js
```

### 2. Base Configuration (`base.js`)

**Strict TypeScript Rules:**

- ✅ `@typescript-eslint/no-explicit-any: error` - No any types allowed
- ✅ `@typescript-eslint/no-unused-vars: error` - Unused variables error (allow `_` prefix)
- ✅ `@typescript-eslint/consistent-type-imports: error` - Enforce type imports
- ✅ `no-var: error` - Must use const/let
- ✅ `prefer-const: error` - Prefer const when not reassigned
- ✅ `no-console: warn` - Only allow console.warn and console.error

**Import Sorting:**

- ✅ Automatic import organization into groups (builtin, external, internal, parent, sibling, index, type)
- ✅ Alphabetical sorting within groups
- ✅ Newlines between groups
- ✅ No duplicate imports

**Integration:**

- ✅ Prettier integration (eslint-config-prettier)
- ✅ TypeScript import resolver
- ✅ Auto-fix enabled for many rules

### 3. Next.js Configuration (`nextjs.js`)

Extends base with Next.js-specific rules:

- ✅ Next.js Core Web Vitals
- ✅ React recommended rules
- ✅ React Hooks rules (strict)
- ✅ JSX accessibility (jsx-a11y)
- ✅ Missing keys in lists (error)
- ✅ Target="\_blank" without rel (error)
- ✅ Unstable nested components (error)
- ✅ Missing alt text (error)
- ✅ Array index as key (warning)

### 4. React Library Configuration (`react-library.js`)

Extends base with React library rules:

- ✅ React recommended rules
- ✅ React Hooks rules
- ✅ JSX accessibility
- ✅ Boolean attributes (must omit true)
- ✅ Unnecessary curly braces (error)
- ✅ Missing keys in lists (error)

### 5. Node.js Configuration (`node.js`)

Extends base with Node.js rules:

- ✅ Console allowed (no warnings)
- ✅ `process.exit()` error (throw errors instead)
- ✅ Sync operations warning
- ✅ Node environment enabled

### 6. Documentation

Created comprehensive `README.md` with:

- Configuration overview
- Usage examples for each config type
- Import sorting examples
- Auto-fix instructions
- IDE integration guide
- Troubleshooting section

---

## 🧪 Tests Written

### Verification Tests (All Passing ✅)

1. **Base Config Test** (`test/base.test.ts`)

   ```bash
   npx eslint -c base.js test/base.test.ts
   ```

   **Violations Caught:**
   - ✅ Import ordering issues (13 errors)
   - ✅ Unused variables
   - ✅ `any` type usage
   - ✅ `var` usage
   - ✅ `console.log` warning
   - ✅ `prefer-const` violations

   **Result**: 13 errors, 1 warning (expected)

2. **Node.js Config Test** (`test/node.test.ts`)

   ```bash
   npx eslint -c node.js test/node.test.ts
   ```

   **Violations Caught:**
   - ✅ `process.exit()` error
   - ✅ Sync operations warning
   - ✅ `any` type error
   - ✅ `var` usage error
   - ✅ Console allowed (no warning)

   **Result**: 4 errors, 1 warning (expected)

3. **React Library Config Test** (`test/react-library.test.tsx`)

   ```bash
   npx eslint -c react-library.js test/react-library.test.tsx
   ```

   **Violations Caught:**
   - ✅ Missing key prop
   - ✅ Boolean attribute with explicit true
   - ✅ Unnecessary curly braces
   - ✅ Missing alt text
   - ✅ Array index as key warning

   **Result**: 5 errors, 1 warning (expected)

4. **Next.js Config Test** (`test/nextjs.test.tsx`)

   ```bash
   npx eslint -c nextjs.js test/nextjs.test.tsx
   ```

   **Violations Caught:**
   - ✅ Missing key prop
   - ✅ Unsafe target="\_blank"
   - ✅ Array index key warning
   - ✅ Missing alt text
   - ✅ Unstable nested component
   - ✅ Next.js specific warning (no-img-element)

   **Result**: 4 errors, 2 warnings (expected)

---

## 🔍 How to Verify

Run the following commands to verify the ESLint configurations:

```bash
# Navigate to the package
cd packages/config-eslint

# Test base configuration
npx eslint -c base.js test/base.test.ts

# Test Node.js configuration
npx eslint -c node.js test/node.test.ts

# Test React library configuration
npx eslint -c react-library.js test/react-library.test.tsx

# Test Next.js configuration
npx eslint -c nextjs.js test/nextjs.test.tsx

# All should report violations (intentional test files)
```

### Expected Behavior

Each test file intentionally contains violations to verify the config catches them. The tests pass if violations are detected.

---

## 📦 Installed Dependencies

```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^8.52.0",
    "@typescript-eslint/parser": "^8.52.0",
    "eslint": "^9.39.2",
    "eslint-config-next": "^15.5.9",
    "eslint-config-prettier": "^9.1.2",
    "eslint-plugin-import": "^2.32.0",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-import-resolver-typescript": "^4.4.4"
  },
  "peerDependencies": {
    "eslint": "^9.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 📝 Notes & Considerations

### Strict Rules

As requested, strict rules are enabled:

- No `any` types
- Unused variables are errors
- Import sorting is enforced
- React/accessibility rules are strict

### Auto-fix

Many rules support auto-fix:

```bash
eslint --fix .
```

Rules with auto-fix:

- Import sorting
- Prefer const
- Type import consistency
- Boolean attributes
- Curly brace presence

### Next.js Config

The Next.js config doesn't extend `base.js` to avoid plugin conflicts with `next/core-web-vitals`. Instead, it duplicates base rules inline to work with Next.js's built-in ESLint config.

### ESLint 9

Using ESLint 9 with TypeScript ESLint 8+ for maximum compatibility. Note: ESLint 9 prefers flat config (`eslint.config.js`) but we're using legacy format for wider compatibility.

### Import Sorting Groups

Imports are sorted into 8 groups:

1. Built-in modules (fs, path)
2. External modules (react, zod)
3. Internal modules (@repo/\*)
4. Parent imports (../)
5. Sibling imports (./)
6. Index imports
7. Object imports
8. Type imports

### Next Steps

These configurations will be used by:

- Task 5.9-5.12: Next.js apps (will use nextjs.js)
- Task 3.10-3.16: UI packages (will use react-library.js)
- Task 2.1-2.8: Database packages (will use node.js)
- All packages: Base rules through inheritance

---

## 🚀 Ready for Next Task

The ESLint configuration package is complete and all configs are verified with passing tests. The monorepo is ready for Task 1.4: Create `@repo/config` - Prettier configuration (if needed) or move to the next planned task.

---

**Commit Message Suggestion**:

```
feat: add shared ESLint configurations with strict rules

- Create @repo/config-eslint package
- Add base.js with strict TypeScript rules
- Add nextjs.js for Next.js applications
- Add react-library.js for React packages
- Add node.js for Node.js packages
- Enable auto-fix and import sorting
- Include verification tests for all configs
- Enforce no any, no unused vars, prefer const
- Integrate with Prettier to avoid conflicts
```
