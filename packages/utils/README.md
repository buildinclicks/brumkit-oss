# @repo/utils

Shared utility functions for React Masters monorepo.

**Built on [lodash-es](https://lodash.com/)** - Battle-tested utilities with tree-shaking support.

## Features

- ✅ **String Utils** - Powered by lodash + custom helpers
- ✅ **Array Utils** - lodash's uniq, chunk, shuffle, groupBy
- ✅ **Object Utils** - lodash's cloneDeep, pick, omit
- ✅ **Date Utils** - Custom formatting and relative time
- ✅ **Fully Tested** - 12+ tests covering all utilities
- ✅ **Type-Safe** - TypeScript with full type inference
- ✅ **Tree-Shakeable** - Only import what you need

## Installation

```bash
# This package is already part of the monorepo
pnpm add @repo/utils --filter your-app
```

## Usage

### String Utilities

```ts
import {
  capitalize,
  camelCase,
  kebabCase,
  snakeCase,
  truncate,
  isEmpty,
  slugify,
  stripHtml,
  wordCount,
} from '@repo/utils/string';

// Capitalize
capitalize('hello'); // "Hello"

// Case conversions
camelCase('hello world'); // "helloWorld"
kebabCase('helloWorld'); // "hello-world"
snakeCase('helloWorld'); // "hello_world"

// Truncate
truncate('Hello World', 8); // "Hello..."

// Slugify for URLs
slugify('Hello, World!'); // "hello-world"

// Strip HTML
stripHtml('<p>Hello</p>'); // "Hello"

// Word count
wordCount('Hello World'); // 2
```

### Array Utilities

```ts
import { unique, chunk, shuffle, groupBy } from '@repo/utils/array';

// Remove duplicates
unique([1, 2, 2, 3]); // [1, 2, 3]

// Chunk into smaller arrays
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// Shuffle randomly
shuffle([1, 2, 3, 4, 5]); // Random order

// Group by key
const users = [
  { name: 'John', role: 'admin' },
  { name: 'Jane', role: 'user' },
  { name: 'Bob', role: 'admin' },
];
groupBy(users, 'role');
// { admin: [{ name: 'John', ... }, { name: 'Bob', ... }], user: [{ name: 'Jane', ... }] }
```

### Object Utilities

```ts
import { deepClone, pick, omit } from '@repo/utils/object';

const user = { id: 1, name: 'John', email: 'john@example.com' };

// Deep clone
const cloned = deepClone(user);

// Pick specific keys
pick(user, ['id', 'name']); // { id: 1, name: "John" }

// Omit specific keys
omit(user, ['email']); // { id: 1, name: "John" }
```

### Date Utilities

```ts
import { formatDate, timeAgo, isToday } from '@repo/utils/date';

const date = new Date('2024-01-15');

// Format as YYYY-MM-DD
formatDate(date); // "2024-01-15"

// Relative time
timeAgo(new Date(Date.now() - 3600000)); // "1 hours ago"

// Check if today
isToday(new Date()); // true
```

## API Reference

### String Utils

| Function     | Description               | Example                                     |
| :----------- | :------------------------ | :------------------------------------------ |
| `capitalize` | Capitalize first letter   | `capitalize('hello')` → `"Hello"`           |
| `camelCase`  | Convert to camelCase      | `camelCase('hello world')` → `"helloWorld"` |
| `kebabCase`  | Convert to kebab-case     | `kebabCase('helloWorld')` → `"hello-world"` |
| `snakeCase`  | Convert to snake_case     | `snakeCase('helloWorld')` → `"hello_world"` |
| `truncate`   | Truncate to length        | `truncate('Hello', 3)` → `"H..."`           |
| `isEmpty`    | Check if empty/whitespace | `isEmpty('  ')` → `true`                    |
| `slugify`    | Create URL-friendly slug  | `slugify('Hello!')` → `"hello"`             |
| `stripHtml`  | Remove HTML tags          | `stripHtml('<p>Hi</p>')` → `"Hi"`           |
| `wordCount`  | Count words               | `wordCount('Hi there')` → `2`               |

### Array Utils

| Function  | Description       | Signature                                            |
| :-------- | :---------------- | :--------------------------------------------------- |
| `unique`  | Remove duplicates | `<T>(arr: T[]) => T[]`                               |
| `chunk`   | Split into chunks | `<T>(arr: T[], size: number) => T[][]`               |
| `shuffle` | Shuffle randomly  | `<T>(arr: T[]) => T[]`                               |
| `groupBy` | Group by key      | `<T>(arr: T[], key: keyof T) => Record<string, T[]>` |

### Object Utils

| Function    | Description        | Signature                                                 |
| :---------- | :----------------- | :-------------------------------------------------------- |
| `deepClone` | Deep clone object  | `<T>(obj: T) => T`                                        |
| `pick`      | Pick specific keys | `<T, K extends keyof T>(obj: T, keys: K[]) => Pick<T, K>` |
| `omit`      | Omit specific keys | `<T, K extends keyof T>(obj: T, keys: K[]) => Omit<T, K>` |

### Date Utils

| Function     | Description                   | Example                  |
| :----------- | :---------------------------- | :----------------------- |
| `formatDate` | Format as YYYY-MM-DD          | `formatDate(new Date())` |
| `timeAgo`    | Relative time ("2 hours ago") | `timeAgo(date)`          |
| `isToday`    | Check if date is today        | `isToday(new Date())`    |

## Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:coverage
```

## Adding New Utilities

1. Add function to appropriate file (`string.ts`, `array.ts`, `object.ts`, `date.ts`)
2. Export from `src/index.ts`
3. Add tests
4. Update this README

### Example

```ts
// packages/utils/src/string.ts
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

// packages/utils/src/string.test.ts
describe('reverse', () => {
  it('should reverse string', () => {
    expect(reverse('hello')).toBe('olleh');
  });
});
```

## TypeScript Support

Full type safety with inference:

```ts
import { pick, groupBy } from '@repo/utils';

interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = { id: 1, name: 'John', email: 'john@example.com' };

// TypeScript knows the return type is Pick<User, "id" | "name">
const picked = pick(user, ['id', 'name']);

// TypeScript enforces valid keys
// pick(user, ['invalid']); // ❌ Error
```

## Dependencies

- `lodash-es` - Core utilities (tree-shakeable)
- `@repo/types` - Type definitions

## Why lodash?

We use **lodash-es** for:

- ✅ Battle-tested reliability
- ✅ Comprehensive utilities (500+ functions available)
- ✅ Community maintained
- ✅ Tree-shaking support (only import what you use)
- ✅ Excellent TypeScript support

## License

Private package for React Masters monorepo.
