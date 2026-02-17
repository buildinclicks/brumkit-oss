# @repo/config-vitest

Shared Vitest configuration for React Masters monorepo.

## Features

- ✅ **Base Configuration** - Common settings for all packages
- ✅ **React Configuration** - jsdom environment for component testing
- ✅ **Node Configuration** - Node environment for utilities/API testing
- ✅ **Coverage Reporting** - v8 provider with multiple formats
- ✅ **Testing Library Integration** - @testing-library/react setup
- ✅ **Sensible Defaults** - Timeouts, mocking, retries configured

## Installation

This package is already part of the monorepo. No installation needed.

## Usage

### For React Packages (Components, Next.js Apps)

Create `vitest.config.ts` in your package:

```ts
import { defineConfig, mergeConfig } from 'vitest/config';
import reactConfig from '@repo/config-vitest/react';

export default mergeConfig(
  reactConfig,
  defineConfig({
    test: {
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  })
);
```

Create `vitest.setup.ts` (copy from `vitest.setup.template.ts`):

```ts
import '@testing-library/jest-dom/vitest';

// Add your test setup here
```

### For Node Packages (Utilities, Types, Config)

Create `vitest.config.ts` in your package:

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

### For Base Configuration (Custom Setup)

```ts
import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '@repo/config-vitest/base';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: 'happy-dom', // or "jsdom" or "node"
      // your custom config
    },
  })
);
```

## Writing Tests

### Unit Test Example (Node)

```ts
// src/utils/add.ts
export function add(a: number, b: number): number {
  return a + b;
}

// src/utils/add.test.ts
import { describe, it, expect } from 'vitest';
import { add } from './add';

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });

  it('should handle negative numbers', () => {
    expect(add(-1, -2)).toBe(-3);
  });

  it('should handle zero', () => {
    expect(add(0, 5)).toBe(5);
  });
});
```

### Component Test Example (React)

```tsx
// src/components/Button.tsx
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// src/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('should render children', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Click me</Button>);

    await user.click(screen.getByText('Click me'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### Async Test Example

```ts
import { describe, it, expect } from 'vitest';

describe('async function', () => {
  it('should resolve with correct value', async () => {
    const result = await fetchData();
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('should reject with error', async () => {
    await expect(fetchInvalidData()).rejects.toThrow('Not found');
  });
});
```

### Mock Example

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock module
vi.mock('./api', () => ({
  fetchUser: vi.fn(),
}));

import { fetchUser } from './api';
import { getUserName } from './user-service';

describe('getUserName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user name', async () => {
    vi.mocked(fetchUser).mockResolvedValue({ name: 'John' });

    const name = await getUserName(1);

    expect(name).toBe('John');
    expect(fetchUser).toHaveBeenCalledWith(1);
  });
});
```

## Running Tests

### From Workspace Root

```bash
# Run all tests in monorepo
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test --coverage

# Run tests for specific package
pnpm --filter @repo/utils test
```

### From Package Directory

```bash
cd packages/utils
pnpm test
```

### Turborepo Integration

Tests run through Turborepo for caching and parallelization:

```bash
# Run tests (cached)
turbo test

# Run tests in watch mode
turbo test:watch
```

## Coverage

Coverage is configured with v8 provider:

```bash
# Generate coverage report
pnpm test --coverage
```

**Output formats**:

- Text (console)
- HTML (`coverage/index.html`)
- JSON (`coverage/coverage.json`)
- LCOV (`coverage/lcov.info`)

**Thresholds**:

- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

## Configuration Details

### Base Config

```ts
{
  test: {
    environment: "node",
    globals: true,
    coverage: { provider: "v8", thresholds: 80% },
    testTimeout: 10000,
    mockReset: true,
    restoreMocks: true,
  }
}
```

### React Config

Extends base with:

- `environment: "jsdom"` - DOM simulation
- `setupFiles` - Testing Library setup
- `css.modules` - CSS module handling

### Node Config

Extends base with:

- `environment: "node"` - No DOM
- `css: false` - No CSS handling

## Best Practices

### 1. Test Structure (AAA Pattern)

```ts
it('should do something', () => {
  // Arrange
  const input = { id: 1 };

  // Act
  const result = doSomething(input);

  // Assert
  expect(result).toBe(expected);
});
```

### 2. Descriptive Test Names

```ts
// ✅ Good
it('should return 404 when user not found', () => {});

// ❌ Bad
it('test user', () => {});
```

### 3. Test One Thing

```ts
// ✅ Good - focused test
it('should validate email format', () => {
  expect(isValidEmail('test@example.com')).toBe(true);
});

it('should reject invalid email', () => {
  expect(isValidEmail('invalid')).toBe(false);
});

// ❌ Bad - testing multiple things
it('should validate email', () => {
  expect(isValidEmail('test@example.com')).toBe(true);
  expect(isValidEmail('invalid')).toBe(false);
  expect(isValidEmail('')).toBe(false);
});
```

### 4. Use beforeEach for Setup

```ts
describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  it('should add numbers', () => {
    expect(calculator.add(1, 2)).toBe(3);
  });
});
```

### 5. Mock External Dependencies

```ts
// ✅ Good - isolated test
vi.mock('./database');
it('should fetch user', async () => {
  vi.mocked(db.query).mockResolvedValue({ id: 1 });
  const user = await getUser(1);
  expect(user.id).toBe(1);
});

// ❌ Bad - hitting real database
it('should fetch user', async () => {
  const user = await getUser(1); // Real DB call
  expect(user.id).toBe(1);
});
```

## Troubleshooting

### Tests not found

**Issue**: Vitest doesn't find test files

**Solution**: Check `include` pattern in your config:

```ts
test: {
  include: ["src/**/*.{test,spec}.{ts,tsx}"],
}
```

### Module not found

**Issue**: Import errors in tests

**Solution**: Check `resolve.alias` in config or add to tsconfig:

```ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
}
```

### jsdom errors

**Issue**: `ReferenceError: document is not defined`

**Solution**: Use React config with jsdom environment:

```ts
import reactConfig from '@repo/config-vitest/react';
```

### Coverage not working

**Issue**: Coverage shows 0%

**Solution**: Run with coverage flag:

```bash
pnpm test --coverage
```

### Timeout errors

**Issue**: Tests timing out

**Solution**: Increase timeout in config:

```ts
test: {
  testTimeout: 30000, // 30 seconds
}
```

## IDE Integration

### VS Code

Install extensions:

- **Vitest** - Run tests from editor
- **Coverage Gutters** - Show coverage inline

Settings:

```json
{
  "vitest.enable": true,
  "vitest.commandLine": "pnpm test"
}
```

### Cursor

Same as VS Code (Cursor is VS Code-based).

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Compatibility

- ✅ Vitest 4.x
- ✅ React 19.x
- ✅ Next.js 15.x
- ✅ TypeScript 5.x
- ✅ Node.js 20+

## Contributing

When adding new test utilities:

1. Add to appropriate config file
2. Document in this README
3. Add example tests

## License

Private package for React Masters monorepo.
