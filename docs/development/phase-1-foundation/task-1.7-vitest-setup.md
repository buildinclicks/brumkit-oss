# Task 1.7: Vitest Testing Framework Setup

**Status**: ✅ Completed  
**Date**: 2026-01-11  
**Phase**: Foundation

---

## 📋 Task Description

Set up Vitest as the testing framework for the entire monorepo with:

- Shared Vitest configurations
- Testing utilities (@testing-library/react)
- Coverage reporting
- Integration with Turborepo
- Example tests to verify setup

---

## ✅ What Was Implemented

### 1. Dependencies Installed

**Workspace root** (`package.json`):

```json
{
  "devDependencies": {
    "vitest": "^4.0.16",
    "@vitest/ui": "^4.0.16",
    "@vitest/coverage-v8": "^4.0.16",
    "@testing-library/react": "^16.3.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^27.4.0",
    "happy-dom": "^20.1.0"
  }
}
```

### 2. Shared Configuration Package (`@repo/config-vitest`)

Created `packages/config-vitest/` with three configuration presets:

#### Base Configuration (`base.ts`)

```ts
{
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 }
    },
    testTimeout: 10000,
    mockReset: true,
    restoreMocks: true,
  }
}
```

**Features**:

- Node environment by default
- Global test functions (describe, it, expect)
- v8 coverage provider with 80% thresholds
- 10-second test timeout
- Automatic mock reset between tests

#### React Configuration (`react.ts`)

```ts
{
  test: {
    environment: "jsdom",  // DOM simulation
    setupFiles: ["./vitest.setup.ts"],  // Testing Library setup
    globals: true,
    css: { modules: { classNameStrategy: "non-scoped" } }
  }
}
```

**Features**:

- jsdom environment for React components
- Setup file for @testing-library/jest-dom
- CSS module handling
- DOM matchers (toBeInTheDocument, etc.)

#### Node Configuration (`node.ts`)

```ts
{
  test: {
    environment: "node",  // No DOM
    globals: true,
    css: false  // No CSS handling
  }
}
```

**Features**:

- Pure Node environment
- No DOM simulation
- Optimized for utilities, APIs, backend logic

### 3. Test Setup Template (`vitest.setup.template.ts`)

Template file for React packages:

```ts
import '@testing-library/jest-dom/vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  /* ... */
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  /* ... */
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  /* ... */
};
```

**Mocks provided**:

- window.matchMedia (for responsive tests)
- IntersectionObserver (for visibility tracking)
- ResizeObserver (for size tracking)

### 4. Example Tests (`test/example.test.ts`)

Created comprehensive example tests:

```ts
describe('Math utilities', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });
    // ... more tests
  });
});

describe('Async operations', () => {
  describe('fetchData', () => {
    it('should fetch data successfully', async () => {
      const result = await fetchData('https://api.example.com');
      expect(result).toEqual({ data: 'Data from https://api.example.com' });
    });
  });
});
```

**Test types demonstrated**:

- Unit tests (math functions)
- Async tests (promises)
- Error handling (throw assertions)
- Decimal comparisons (toBeCloseTo)

### 5. Package Scripts

Added to `packages/config-vitest/package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 6. Documentation (`README.md`)

Comprehensive documentation with:

- Installation instructions
- Usage examples for React, Node, and base configs
- Writing tests guide (unit, component, async, mock)
- Running tests commands
- Coverage configuration
- Best practices
- Troubleshooting guide
- IDE integration tips
- CI/CD examples

---

## 🧪 Verification

### Tests Run Successfully

```bash
cd packages/config-vitest
pnpm test
```

**Output**:

```
✓ test/example.test.ts (13 tests) 228ms

Test Files  1 passed (1)
     Tests  13 passed (13)
  Duration  654ms
```

**All 13 tests passed!** ✅

### Test Breakdown

- ✅ add() function: 3 tests
- ✅ subtract() function: 2 tests
- ✅ multiply() function: 3 tests
- ✅ divide() function: 3 tests (including error case)
- ✅ fetchData() async function: 2 tests

---

## 📁 Files Created

```
packages/config-vitest/
├── package.json (package metadata + scripts)
├── base.ts (base Vitest config)
├── react.ts (React-specific config)
├── node.ts (Node-specific config)
├── vitest.setup.template.ts (setup template for React)
├── vitest.config.ts (test config for this package)
├── tsconfig.json (TypeScript config)
├── README.md (comprehensive documentation)
└── test/
    ├── example.ts (example utilities)
    └── example.test.ts (example tests)
```

---

## 🎓 Key Concepts Learned

### 1. Vitest vs Jest

**Why Vitest?**

- ⚡ **Faster**: Native ESM support, instant HMR
- 🔧 **Vite-powered**: Uses Vite's transform pipeline
- 📦 **Smaller**: No additional dependencies for ESM
- 🎯 **Compatible**: Jest-like API (easy migration)
- 🔥 **Modern**: Built for modern JavaScript/TypeScript

### 2. Test Environments

**Node Environment**:

- Use for: Utilities, APIs, backend logic
- No DOM simulation
- Faster test execution

**jsdom Environment**:

- Use for: React components
- DOM simulation (document, window, etc.)
- Slightly slower (DOM parsing overhead)

**happy-dom Environment**:

- Alternative to jsdom
- Faster but less complete
- Good for simple component tests

### 3. Coverage Thresholds

```ts
coverage: {
  thresholds: {
    lines: 80,        // 80% of lines executed
    functions: 80,    // 80% of functions called
    branches: 80,     // 80% of if/else branches taken
    statements: 80,   // 80% of statements executed
  }
}
```

**Why 80%?**

- Industry standard for good coverage
- Catches most bugs
- Not too strict (allows pragmatic decisions)
- Can be adjusted per package if needed

### 4. Test Organization (AAA Pattern)

```ts
it('should do something', () => {
  // Arrange - setup test data
  const input = { id: 1 };

  // Act - execute the code under test
  const result = doSomething(input);

  // Assert - verify the result
  expect(result).toBe(expected);
});
```

### 5. Mocking Strategy

**Mock external dependencies, not internal logic**:

```ts
// ✅ Good - mock external API
vi.mock('./api');
vi.mocked(fetchUser).mockResolvedValue({ name: 'John' });

// ❌ Bad - mocking internal logic defeats purpose of test
vi.mock('./user-service'); // Don't mock what you're testing!
```

---

## 📝 Usage Examples

### For React Component Tests

**1. Create `vitest.config.ts`**:

```ts
import { defineConfig, mergeConfig } from 'vitest/config';
import reactConfig from '@repo/config-vitest/react';

export default mergeConfig(
  reactConfig,
  defineConfig({
    test: {
      include: ['src/**/*.{test,spec}.tsx'],
    },
  })
);
```

**2. Create `vitest.setup.ts`** (copy from template)

**3. Write component test**:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

it('should call onClick when clicked', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();

  render(<Button onClick={onClick}>Click me</Button>);
  await user.click(screen.getByText('Click me'));

  expect(onClick).toHaveBeenCalledTimes(1);
});
```

### For Node/Utility Tests

**1. Create `vitest.config.ts`**:

```ts
import { defineConfig, mergeConfig } from 'vitest/config';
import nodeConfig from '@repo/config-vitest/node';

export default mergeConfig(
  nodeConfig,
  defineConfig({
    test: {
      include: ['src/**/*.test.ts'],
    },
  })
);
```

**2. Write utility test**:

```ts
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('should format USD currency', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });
});
```

---

## 🔧 Integration with Turborepo

Turborepo automatically runs tests across packages:

```bash
# Run all tests (cached)
turbo test

# Run tests in watch mode
turbo test:watch

# Run tests with coverage
turbo test --coverage
```

**Caching**: Turborepo caches test results based on:

- Source code changes
- Test file changes
- Dependency changes

**Parallelization**: Tests run in parallel across packages.

---

## 📊 Coverage Reports

**Generate coverage**:

```bash
pnpm test --coverage
```

**Output locations**:

- `coverage/index.html` - Interactive HTML report
- `coverage/lcov.info` - LCOV format (for CI tools)
- `coverage/coverage.json` - JSON format
- Terminal - Text summary

**View HTML report**:

```bash
# Open in browser
start coverage/index.html  # Windows
open coverage/index.html   # macOS
```

---

## 🎯 Best Practices Established

### 1. One Assertion Per Test (Usually)

```ts
// ✅ Good - focused test
it('should return user name', () => {
  expect(user.name).toBe('John');
});

it('should return user email', () => {
  expect(user.email).toBe('john@example.com');
});

// ⚠️ Okay - related assertions
it('should return complete user data', () => {
  expect(user.name).toBe('John');
  expect(user.email).toBe('john@example.com');
});
```

### 2. Descriptive Test Names

```ts
// ✅ Good - clear what's being tested
it('should throw error when email is invalid', () => {});

// ❌ Bad - vague
it('email validation', () => {});
```

### 3. Use beforeEach for Common Setup

```ts
describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it('should create user', () => {
    // service is already initialized
  });
});
```

### 4. Clean Up After Tests

```ts
afterEach(() => {
  vi.restoreAllMocks(); // Restore mocked functions
  cleanup(); // Clean up rendered components
});
```

---

## 🐛 Troubleshooting

### Issue: `ReferenceError: document is not defined`

**Cause**: Using DOM in Node environment

**Solution**: Use React config with jsdom:

```ts
import reactConfig from '@repo/config-vitest/react';
```

### Issue: Tests timing out

**Cause**: Async operation takes too long

**Solution**: Increase timeout:

```ts
it('slow test', async () => {
  // ...
}, 30000); // 30 seconds
```

### Issue: Coverage shows 0%

**Cause**: Not running with coverage flag

**Solution**:

```bash
pnpm test --coverage
```

### Issue: Module not found in tests

**Cause**: Path alias not configured

**Solution**: Add to `vitest.config.ts`:

```ts
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## 🚀 Next Steps

### Immediate

1. Add tests to existing packages (config-typescript, config-eslint, config-tailwind)
2. Follow TDD for new code (RED → GREEN → REFACTOR)

### Future Enhancements

1. **Playwright** for E2E tests (Phase 10)
2. **MSW** for API mocking (Phase 3-4)
3. **Test utilities package** (`@repo/test-utils`) (Phase 3)
4. **CI/CD integration** (GitHub Actions) (Phase 10)

---

## ✅ Task Complete!

**Files Created**:

- `packages/config-vitest/` (complete package)
- `docs/development/phase-1-foundation/task-1.7-vitest-setup.md` (this file)

**Dependencies Installed**:

- `vitest@4.0.16`
- `@vitest/ui@4.0.16`
- `@vitest/coverage-v8@4.0.16`
- `@testing-library/react@16.3.1`
- `@testing-library/jest-dom@6.9.1`
- `@testing-library/user-event@14.6.1`
- `jsdom@27.4.0`
- `happy-dom@20.1.0`

**Tests Verified**: ✅ 13/13 passing

**Ready for**: TDD approach in all future tasks! 🧪
